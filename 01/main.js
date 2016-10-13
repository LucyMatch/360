/////// Three.js EQUIRECTANGULAR PANORAMA VIDEO PLAYER
/////// Based off three.js example - https://github.com/mrdoob/three.js/blob/master/examples/webgl_video_panorama_equirectangular.html
////// MEDIA: from - https://www.youtube.com/watch?v=yunoMLfc2Wc - Creative Commons Attribution license (reuse allowed)


///define vars
var camera, scene, renderer;

var texture_placeholder,
interaction = false,
onMouseDownMouseX = 0, onMouseDownMouseY = 0,
lon = 0, onMouseDownLon = 0,
lat = 0, onMouseDownLat = 0,
phi = 0, theta = 0,
distance = 500;

init();
animate();

function init(){
    var container, mesh;
    //get html container
    container = document.getElementById( 'container' );
    //set up camera & start it at 000
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100);
    camera.target = new THREE.Vector3 ( 0, 0, 0 );
    //create a scene for us to put everything in
    scene = new THREE.Scene();
    //the sphere we map our video to
    var geometry = new THREE.SphereBufferGeometry( 500 , 60 , 40); // size?
    geometry.scale( -1, 1 ,1 );
    //create a video container in the HTML that we can pull our video file from & make a texture out of it
    var video = document.createElement( 'video' );
    video.width = 640;
    video.height = 360;
    video.loop = true;
    video.muted = true;
    video.src = "../assets/vid/test.mp4";
    video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
    video.play();
    // create a texture out of our video
    var texture = new THREE.VideoTexture( video );
    texture.minFilter = THREE.LinearFilter; // otherfilters?
    texture.format = THREE.RGBFormat;
    //create the material for the sphere that we map our video texture to
    var material = new THREE.MeshBasicMaterial( { map : texture } );
    //combine the geometry and the material
    mesh = new THREE.Mesh( geometry, material );
    //add it to the scene!
    scene.add( mesh );
    //create renderer and add it to our html container
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousedown', onMouseDown, false );
    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'mouseup', onMouseUp, false );
    //
    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onMouseDown ( event ) {
    event.preventDefault();
    interaction = true;
    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;
}

function onMouseMove ( event ) {
    if ( interaction === true ) {
        lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
        lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
    }
}

function onMouseUp( event ) {
    interaction = false;
}

function animate() {
    requestAnimationFrame( animate );
    update();
}

function update() {

    lat = Math.max( - 85, Math.min( 85, lat ) );
    phi = THREE.Math.degToRad( 90 - lat );
    theta = THREE.Math.degToRad( lon );
    camera.position.x = distance * Math.sin( phi ) * Math.cos( theta );
    camera.position.y = distance * Math.cos( phi );
    camera.position.z = distance * Math.sin( phi ) * Math.sin( theta );
    camera.lookAt( camera.target );
    /*
    // distortion
    camera.position.copy( camera.target ).negate();
    */
    renderer.render( scene, camera );

}
