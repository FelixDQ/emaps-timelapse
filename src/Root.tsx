import { Composition } from 'remotion';
import { Scene1, scene1Schema } from './Scene1';
// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="Scene1"
				component={Scene1}
				durationInFrames={30 * 20}
				fps={30}
				width={1920}
				height={1080}
				schema={scene1Schema}
				defaultProps={{
					startLat: 56,
					startLon: 11,
					startZoom: 5.5,
					endLat: 55,
					endLon: 9,
					endZoom: 3,
				}}
			/>
		</>
	);
};
