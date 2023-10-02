var recorder = null
function onAccessApproved(stream){
    recorder = new MediaRecorder(stream);

    recorder.start();

    recorder.onstop = function(){
        stream.getTracks().forEach(function(track){
            if(track.readyState === "live"){
                track.stop()
            }
        })
    }

    recorder.ondataavailable = async function(event){
        let recordedBlob  = event.data
        let formData = new FormData();
        formData.append('title', 'GafrecordedBlob')
        formData.append('video_file', recordedBlob, 'myvideo.webm')
        let response = await fetch('https://screenrecording.ifeoluwaadefioy.repl.co/app/api/screen-recordings/?format=api', {
            method: 'POST',
            body: formData
        })
        if (response.status === 201){
            console.log('Message', response)
            let getURL = await fetch('https://screenrecording.ifeoluwaadefioy.repl.co/app/api/screenrecordings/?format=api', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log('Second Message', getURL.name)
        }
    }
}


chrome.runtime.onMessage.addListener( (message, sender, sendResponse)=>{

    if(message.action === "request_recording"){
        console.log("requesting recording")

        sendResponse(`processed: ${message.action}`);

        navigator.mediaDevices.getDisplayMedia({
            audio:true,
            video: {
                width:9999999999,
                height: 9999999999
            }
        }).then((stream)=>{
            onAccessApproved(stream)
        })  
    }

    if(message.action === "stopvideo"){
        console.log("stopping video");
        sendResponse(`processed: ${message.action}`);
        if(!recorder) return console.log("no recorder")

        recorder.stop();
        window.open('https://helpout-web.vercel.app/', '_blank')


    }

})