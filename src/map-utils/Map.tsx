import {Layer, Map, MapRef, Source} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import {MapGeometries} from './types';
import {styles} from './theme';

export const ElectricityMap: React.FC<{
	mapReference: any;
	viewState: any;
	geometries: MapGeometries;
}> = ({mapReference, viewState, geometries}) => {
	return (
		<Map
			ref={mapReference}
			// initialViewState={{
			// 	latitude: 55.905,
			// 	longitude: 10.528,
			// 	zoom: 5.5,
			// }}
			viewState={viewState}
			dragPan={false}
			dragRotate={false}
			doubleClickZoom={false}
			touchZoom={false}
			touchRotate={false}
			touchPitch={false}
			mapLib={maplibregl}
		>
			<Layer id="ocean" type="background" paint={styles.ocean} />
			<Source
				id="zones-clickable"
				promoteId="zoneId"
				type="geojson"
				data={geometries}
			>
				<Layer
					id="zones-clickable-layer"
					type="fill"
					paint={styles.zonesClickable}
				/>
				<Layer
					id="zones-hoverable-layer"
					type="fill"
					paint={styles.zonesHover}
				/>
				<Layer id="zones-border" type="line" paint={styles.zonesBorder} />
			</Source>
		</Map>
	);
};
