import { Layer, Map, MapRef, Source } from 'react-map-gl';
import { spring } from 'remotion';
import {
	AbsoluteFill,
	interpolate,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	random,
} from 'remotion';
import maplibregl from 'maplibre-gl';
import { z } from 'zod';
import { generateTopos } from './map-utils/generateTopos';
import { theme } from './map-utils/theme';
import { useRef, useMemo } from 'react';
import { getCo2ColorScale } from './map-utils/co2scale';
import co2Data from './data.json';
import { ResponsiveLine } from '@nivo/line'
import { ElectricityMap } from './map-utils/Map';

const dates = Object.keys(co2Data);



export const scene1Schema = z.object({
	startLat: z.number(),
	startLon: z.number(),
	startZoom: z.number(),
	endLat: z.number(),
	endLon: z.number(),
	endZoom: z.number(),
});


export const Scene1: React.FC<z.infer<typeof scene1Schema>> = ({ startLat, startLon, endLat, endLon, startZoom, endZoom }) => {
	const mapReference = useRef<MapRef>(null);
	const frame = useCurrentFrame();
	const { durationInFrames, fps } = useVideoConfig();

	const dateIndex = Math.floor((frame / durationInFrames) * dates.length);
	const dateForThisFrame = dates[dateIndex];
	const previousDates = dates.slice(0, dateIndex);

	const zonesInChart = ['DK', 'DE', 'FR']
	const chartData = zonesInChart.map(zoneId => ({
		id: zoneId,
		data: previousDates.map(date => ({
			x: date,
			y: parseFloat(co2Data[date][zoneId]),
		}))
	})
	);
	console.log(chartData);


	const mapTranslationProgress
		= spring({
			frame: frame,
			fps,
			durationInFrames: durationInFrames,
			config: {
				damping: 300,
			},
		});

	const mapZoom = interpolate(mapTranslationProgress, [0, 1], [startZoom, endZoom]);
	const mapLat = interpolate(mapTranslationProgress, [0, 1], [startLat, endLat]);
	const mapLon = interpolate(mapTranslationProgress, [0, 1], [startLon, endLon]);



	const co2Scale = getCo2ColorScale(theme);

	const geometries = useMemo(generateTopos, []);

	const map = mapReference.current?.getMap();
	for (const feature of geometries.features) {
		if (!map) {
			continue;
		}
		const { zoneId } = feature.properties;
		const co2Value = parseFloat(co2Data[dateForThisFrame][zoneId]);
		const zoneColor = co2Scale(co2Value);
		map.setFeatureState(
			{
				source: 'zones-clickable',
				id: zoneId,
			},
			{
				color: zoneColor,
			}
		);
	}

	return (
		<AbsoluteFill style={{ backgroundColor: 'white' }}>
			<AbsoluteFill>
				<div style={{
					position: 'absolute',
					top: 0,
					left: 0,
					fontSize: 32,
					padding: 10,
					backgroundColor: 'rgba(0,0,0,0.5)',
					color: 'white',
					zIndex: 9999,
					fontFamily: 'Helvetica',
				}}>
					{dateForThisFrame}
				</div>
			</AbsoluteFill>
			<AbsoluteFill>
				<div style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					padding: 0,
					width: '100%',
					height: 200,
					backgroundColor: 'rgba(255,255,255,0.7)',
					borderTopLeftRadius: 25,
					borderTopRightRadius: 25,
					zIndex: 9999,
				}}>
					<ResponsiveLine
						data={chartData}
						xScale={{
							type: 'time',
							format: '%Y-%m-%d %H:%M:%S',
							useUTC: true,
							precision: 'second',
							min: '2022-01-01 00:00:00',
							max: '2022-12-31 23:00:00',
						}}
						xFormat="time:%Y-%m-%d %H:%M:%S.%"
						yScale={{
							type: 'linear',
							min: 0,
							max: 800,
						}}
						axisLeft={{
							legend: 'CO2 (g/kWh)',
							legendOffset: -50,
							legendPosition: 'middle',
						}}
						axisBottom={{
							format: '%Y-%m-%d',
							tickValues: 'every 20 days',
						}}
						enablePointLabel={false}
						useMesh={true}
						enableSlices={false}
						enablePoints={false}
						margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
						legends={[
							{
								anchor: 'bottom-right',
								direction: 'column',
								justify: false,
								translateX: 100,
								translateY: 0,
								itemsSpacing: 0,
								itemDirection: 'left-to-right',
								itemWidth: 80,
								itemHeight: 20,
								itemOpacity: 0.75,
								symbolSize: 12,
								symbolShape: 'circle',
								symbolBorderColor: 'rgba(0, 0, 0, .5)',
								effects: [
									{
										on: 'hover',
										style: {
											itemBackground: 'rgba(0, 0, 0, .03)',
											itemOpacity: 1
										}
									}
								]
							}
						]}

					/>
				</div>
			</AbsoluteFill>
			<ElectricityMap
				mapReference={mapReference}
				viewState={{
					latitude: mapLat,
					longitude: mapLon,
					zoom: mapZoom,
				}}
				geometries={geometries}
			/>
		</AbsoluteFill>
	);
};
