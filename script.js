const video= document.getElementById('video');

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),    
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),    
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),    
    faceapi.nets.faceExpressionNet.loadFromUri('./models'),    

]).then(startVideo);

// Promise.all([
//     faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
//     faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//     faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
//     faceapi.nets.faceExpressionNet.loadFromUri('/models')
// ]).then(startVideo);


async function startVideo() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;
    } catch (error) {
        console.error(error);
    }
} 

// startVideo();

video.addEventListener('play',()=>{
    const canvas=faceapi.createCanvasFromMedia(video);
    document.body.append(canvas)
    const displaysize={width: video.width, height: video.height}
    faceapi.matchDimensions(canvas, displaysize)
    setInterval(async()=>{
        const detections = await faceapi.detectAllFaces(video,
        new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        console.log(detections);
        const resizeDetections=faceapi.resizeResults(detections, displaysize);
        canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizeDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizeDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizeDetections);
        
    },100)
})