import {MapTheme} from './types';

export const theme: MapTheme = {
	co2Scale: {
		steps: [0, 150, 600, 800, 1100, 1500],
		colors: ['#2AA364', '#F5EB4D', '#9E4229', '#381D02', '#381D02', '#000'],
	},
	oceanColor: '#FAFAFA',
	strokeWidth: 2.5,
	strokeColor: '#FAFAFA',
	clickableFill: '#D4D9DE',
	nonClickableFill: '#D4D9DE',
};


export const styles = {
	ocean: {'background-color': theme.oceanColor},
	zonesBorder: {
		'line-color': [
			'case',
			['boolean', ['feature-state', 'selected'], false],
			'white',
			theme.strokeColor,
		],
		// Note: if stroke width is 1px, then it is faster to use fill-outline in fill layer
		'line-width': [
			'case',
			['boolean', ['feature-state', 'selected'], false],
			(theme.strokeWidth as number) * 10,
			theme.strokeWidth,
		],
	} as mapboxgl.LinePaint,
	zonesClickable: {
		'fill-color': [
			'coalesce',
			['feature-state', 'color'],
			['get', 'color'],
			theme.clickableFill,
		],
	} as mapboxgl.FillPaint,
	zonesHover: {
		'fill-color': '#FFFFFF',
		'fill-opacity': [
			'case',
			['boolean', ['feature-state', 'hover'], false],
			0.3,
			0,
		],
	} as mapboxgl.FillPaint,
};