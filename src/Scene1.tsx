import {Layer, Map, MapRef, Source} from 'react-map-gl';
import {spring} from 'remotion';
import {
	AbsoluteFill,
	interpolate,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	random,
} from 'remotion';
import maplibregl from 'maplibre-gl';
import {z} from 'zod';
import {generateTopos} from './map-utils/generateTopos';
import {theme} from './map-utils/theme';
import {useRef, useMemo} from 'react';
import {getCo2ColorScale} from './map-utils/co2scale';

import {ElectricityMap} from './map-utils/Map';
export const scene1Schema = z.object({test: z.string()});

export const Scene1: React.FC<z.infer<typeof scene1Schema>> = ({test}) => {
	const mapReference = useRef<MapRef>(null);
	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();

	const mapZoomProgress = spring({
		frame: frame - 25,
		fps,
		durationInFrames: fps * 3,
		config: {
			damping: 300,
		},
	});

	const mapZoom = interpolate(mapZoomProgress, [0, 1], [3.5, 5.5]);

	const colorProgress = spring({
		frame: frame - 25,
		fps,
		durationInFrames: fps * 3,
		config: {
			damping: 300,
		},
	});
	const colorValue = interpolate(colorProgress, [0, 1], [0, 1000]);
	const co2Scale = getCo2ColorScale(theme);

	const geometries = useMemo(generateTopos, []);

	const map = mapReference.current?.getMap();
	for (const feature of geometries.features) {
		if (!map) {
			continue;
		}
		const {zoneId} = feature.properties;
		const zoneColor = co2Scale((colorValue * random(zoneId)) % 1000);
		console.log(colorValue);
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
		<AbsoluteFill style={{backgroundColor: 'white'}}>
			<ElectricityMap
				mapReference={mapReference}
				viewState={{
					latitude: 55.905,
					longitude: 10.528,
					zoom: mapZoom,
				}}
				geometries={geometries}
			/>
		</AbsoluteFill>
	);
};
