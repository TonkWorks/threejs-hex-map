import {
	Matrix4,
	Object3D,
	Quaternion,
	Vector3
} from 'three';

//
// Utility functions
//

// Return 0 for values very near zero
function epsilon( value ) {
	return Math.abs( value ) < 1e-10 ? 0 : value;
}

// A generic function to produce a CSS matrix3d string from an array of 16 numbers.
// The sign adjustments are provided in the signAdjust array (which has 16 values, either 1 or -1).
function buildCSSMatrix( elements, signAdjust ) {
	let css = 'matrix3d(';
	for ( let i = 0; i < 16; i ++ ) {
		css += epsilon( elements[ i ] * signAdjust[ i ] ) + ( i < 15 ? ',' : ')' );
	}
	return css;
}

// For camera, we want to flip the sign of elements 1, 5, 9, 13.
const cameraSignAdjust = [
	 1, -1,  1,  1,
	 1, -1,  1,  1,
	 1, -1,  1,  1,
	 1, -1,  1,  1
];

// For objects we flip the sign of elements 4, 5, 6, 7.
const objectSignAdjust = [
	1,  1,  1,  1,
   -1, -1, -1, -1,
	1,  1,  1,  1,
	1,  1,  1,  1
];

// Build CSS matrix for camera using cameraSignAdjust.
function getCameraCSSMatrix( matrix ) {
	return buildCSSMatrix( matrix.elements, cameraSignAdjust );
}

// Build CSS matrix for objects using objectSignAdjust, plus a translate(-50%,-50%) offset.
function getObjectCSSMatrix( matrix ) {
	return 'translate(-50%,-50%)' + buildCSSMatrix( matrix.elements, objectSignAdjust );
}

//
// CSS3DObject and CSS3DSprite classes
//

const _position = new Vector3();
const _quaternion = new Quaternion();
const _scale = new Vector3();

class CSS3DObject extends Object3D {

	constructor( element = document.createElement( 'div' ) ) {

		super();

		this.isCSS3DObject = true;

		this.element = element;
		this.element.style.position = 'absolute';
		this.element.style.pointerEvents = 'auto';
		this.element.style.userSelect = 'none';
		this.element.style.willChange = 'transform'; // Hint for browsers

		this.element.setAttribute( 'draggable', false );

		this.addEventListener( 'removed', function () {

			this.traverse( function ( object ) {

				// Remove from DOM if element exists.
				if (
					object.element instanceof object.element.ownerDocument.defaultView.Element &&
					object.element.parentNode !== null
				) {

					object.element.remove();

				}

			} );

		} );

	}

	copy( source, recursive ) {

		super.copy( source, recursive );

		this.element = source.element.cloneNode( true );

		return this;

	}

}

class CSS3DSprite extends CSS3DObject {

	constructor( element ) {

		super( element );

		this.isCSS3DSprite = true;

		this.rotation2D = 0;

	}

	copy( source, recursive ) {

		super.copy( source, recursive );

		this.rotation2D = source.rotation2D;

		return this;

	}

}

//
// CSS3DRenderer class
//

const _matrix = new Matrix4();
const _matrix2 = new Matrix4();

class CSS3DRenderer {

	constructor( parameters = {} ) {

		const _this = this;

		let _width, _height;
		let _widthHalf, _heightHalf;

		// Cache to avoid unnecessary DOM updates.
		const cache = {
			camera: { style: '' },
			objects: new WeakMap()
		};

		const domElement = parameters.element !== undefined ? parameters.element : document.createElement( 'div' );

		domElement.style.overflow = 'hidden';

		this.domElement = domElement;

		const viewElement = document.createElement( 'div' );
		viewElement.style.transformOrigin = '0 0';
		viewElement.style.pointerEvents = 'none';
		domElement.appendChild( viewElement );

		const cameraElement = document.createElement( 'div' );
		cameraElement.style.transformStyle = 'preserve-3d';
		cameraElement.style.pointerEvents = 'none';
		viewElement.appendChild( cameraElement );

		this.getSize = function () {

			return {
				width: _width,
				height: _height
			};

		};

		this.render = function ( scene, camera ) {

			// Calculate the field-of-view value from the camera's projection matrix
			const fov = camera.projectionMatrix.elements[ 5 ] * _heightHalf;

			// Handle camera view offsets, if set.
			if ( camera.view && camera.view.enabled ) {

				viewElement.style.transform = `translate(${ -camera.view.offsetX * ( _width / camera.view.width ) }px,${ -camera.view.offsetY * ( _height / camera.view.height ) }px)` +
					`scale(${ camera.view.fullWidth / camera.view.width },${ camera.view.fullHeight / camera.view.height })`;

			} else {

				viewElement.style.transform = '';

			}

			if ( scene.matrixWorldAutoUpdate === true ) scene.updateMatrixWorld();
			if ( camera.parent === null && camera.matrixWorldAutoUpdate === true ) camera.updateMatrixWorld();

			let tx = 0, ty = 0;

			if ( camera.isOrthographicCamera ) {

				tx = - ( camera.right + camera.left ) / 2;
				ty = ( camera.top + camera.bottom ) / 2;

			}

			const scaleByViewOffset = camera.view && camera.view.enabled ? camera.view.height / camera.view.fullHeight : 1;

			// Create the CSS transform for the camera.
			const cameraCSSMatrix = camera.isOrthographicCamera ?
				`scale(${ scaleByViewOffset }) scale(${ fov }) translate(${ epsilon( tx ) }px,${ epsilon( ty ) }px)${ getCameraCSSMatrix( camera.matrixWorldInverse ) }` :
				`scale(${ scaleByViewOffset }) translateZ(${ fov }px)${ getCameraCSSMatrix( camera.matrixWorldInverse ) }`;
			const perspective = camera.isPerspectiveCamera ? `perspective(${ fov }px) ` : '';

			const style = perspective + cameraCSSMatrix + `translate(${ _widthHalf }px,${ _heightHalf }px)`;

			if ( cache.camera.style !== style ) {

				cameraElement.style.transform = style;
				cache.camera.style = style;

			}

			// === Optimization: Precompute billboard matrix for sprites once ===
			// For sprites we need the transposed camera inverse.
			const billboardMatrix = new Matrix4().copy( camera.matrixWorldInverse ).transpose();

			renderObject( scene, scene, camera, cameraCSSMatrix, billboardMatrix, cameraElement );

		};

		this.setSize = function ( width, height ) {

			_width = width;
			_height = height;
			_widthHalf = _width / 2;
			_heightHalf = _height / 2;

			domElement.style.width = width + 'px';
			domElement.style.height = height + 'px';

			viewElement.style.width = width + 'px';
			viewElement.style.height = height + 'px';

			cameraElement.style.width = width + 'px';
			cameraElement.style.height = height + 'px';

		};

		// Hide the DOM element for an object (and its children) that is not visible.
		function hideObject( object ) {

			if ( object.isCSS3DObject ) object.element.style.display = 'none';

			for ( let i = 0, l = object.children.length; i < l; i++ ) {

				hideObject( object.children[ i ] );

			}

		}

		// Render a single object (recursively).
		function renderObject( object, scene, camera, cameraCSSMatrix, billboardMatrix, cameraElement ) {

			if ( object.visible === false ) {

				hideObject( object );
				return;

			}

			if ( object.isCSS3DObject ) {

				// Only show the object if its layers match the camera’s.
				const visible = object.layers.test( camera.layers );

				const element = object.element;
				element.style.display = visible ? '' : 'none';

				if ( visible ) {

					// Call before-render hook if defined.
					if ( object.onBeforeRender ) object.onBeforeRender( _this, scene, camera );

					let style;

					if ( object.isCSS3DSprite ) {

						// === Sprite Optimization ===
						// Start from the precomputed billboard matrix
						_matrix.copy( billboardMatrix );

						// Apply the sprite's 2D rotation if needed.
						if ( object.rotation2D !== 0 ) {
							_matrix.multiply( _matrix2.makeRotationZ( object.rotation2D ) );
						}

						// Apply the sprite’s position and scale.
						object.matrixWorld.decompose( _position, _quaternion, _scale );
						_matrix.setPosition( _position );
						_matrix.scale( _scale );

						// Clean up the bottom row (not needed for CSS transforms).
						_matrix.elements[ 3 ] = 0;
						_matrix.elements[ 7 ] = 0;
						_matrix.elements[ 11 ] = 0;
						_matrix.elements[ 15 ] = 1;

						style = getObjectCSSMatrix( _matrix );

					} else {

						style = getObjectCSSMatrix( object.matrixWorld );

					}

					// Update the transform only if it has changed.
					const cachedObject = cache.objects.get( object );
					if ( !cachedObject || cachedObject.style !== style ) {
						element.style.transform = style;
						cache.objects.set( object, { style } );
					}

					// If the element isn’t already attached, add it.
					if ( element.parentNode !== cameraElement ) {
						cameraElement.appendChild( element );
					}

					if ( object.onAfterRender ) object.onAfterRender( _this, scene, camera );

				}

			}

			// Recurse for all children.
			for ( let i = 0, l = object.children.length; i < l; i++ ) {
				renderObject( object.children[ i ], scene, camera, cameraCSSMatrix, billboardMatrix, cameraElement );
			}

		}

	}

}

export { CSS3DObject, CSS3DSprite, CSS3DRenderer };
