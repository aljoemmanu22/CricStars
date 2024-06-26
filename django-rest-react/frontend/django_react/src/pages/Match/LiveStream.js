import React, { useEffect, useState, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import axios from 'axios';

const APP_ID = '8291cec2c36b4c39aa834e3d06b6363d'; // replace with your Agora App ID

const LiveStream = ({ channelName, isStreaming, onStreamingEnd }) => {
  const [client, setClient] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [isStreamStarted, setIsStreamStarted] = useState(false);
  const videoRef = useRef();
  const baseURL = 'http://127.0.0.1:8000';

  useEffect(() => {
    if (isStreaming && !isStreamStarted) {
      const initAgora = async () => {
        const agoraClient = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
        setClient(agoraClient);

        try {
          const tokenResponse = await axios.get(`${baseURL}/api/generate-token/`, {
            params: { channelName: channelName }
          });

          const { token, uid } = tokenResponse.data;

          await agoraClient.join(APP_ID, channelName, token, uid);
          console.log('Joined channel successfully');
          
          agoraClient.setClientRole('host');
          console.log('Client role set to host');

          const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
          const videoTrack = await AgoraRTC.createCameraVideoTrack();

          setLocalAudioTrack(audioTrack);
          setLocalVideoTrack(videoTrack);

          // Attach video track to the video DOM element
          videoTrack.play(videoRef.current);

          await agoraClient.publish([audioTrack, videoTrack]);
          console.log('Published audio and video tracks');
          setIsStreamStarted(true);
        } catch (error) {
          console.error('Failed to initialize Agora and join channel', error);
        }
      };

      initAgora();
    }

    return () => {
      if (!isStreaming && isStreamStarted) {
        if (localAudioTrack) localAudioTrack.close();
        if (localVideoTrack) localVideoTrack.close();
        if (client) client.leave();
        setIsStreamStarted(false);
        onStreamingEnd();
        console.log('Stopped streaming and cleaned up');
      }
    };
  }, [channelName, isStreaming, isStreamStarted, onStreamingEnd, localAudioTrack, localVideoTrack, client]);

  // Ensure videoRef is cleared when component unmounts
  useEffect(() => {
    return () => {
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
      }
    };
  }, [localVideoTrack]);

  return (
    <div>
      <div id="local-stream" ref={videoRef} style={{ width: '640px', height: '480px' }}></div>
      {isStreamStarted && <p>Streaming started...</p>}
      {!isStreaming && isStreamStarted && <p>Streaming stopped.</p>}
    </div>
  );
};

export default LiveStream;
