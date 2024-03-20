import {ConfigureDaemon, GetLog, GetLoggingMoonlight, GetServerLog, StartMoonlight, StartThinkmay} from "../src-tauri/tauri.ts"


document.addEventListener('DOMContentLoaded', () => {
  console.log('hello from thinkmay')
  const moonlightBtn = document.getElementById("Moonlight-btn");
  const configureBtn = document.getElementById("Configure-btn");
  if (moonlightBtn == null || configureBtn == null) {
    console.log('Connection button is not available')
    return
  }


  moonlightBtn.onclick = async () => {
    const ip = document.getElementById("ipAddress").value;
    const bitrate = document.getElementById("bitrate").value;
    const height = document.getElementById("height").value;
    const width = document.getElementById("width").value;




    StartMoonlight(ip, {
      bitrate: bitrate,
      width: width * 1000,  
      height: height
    }, 
    (data) => {
      const logDiv = document.getElementById("moonlightLog");
      logDiv.innerHTML = logDiv.innerHTML + data + "<br>";
    })
  }

  configureBtn.onclick = async () => {
    const ip = document.getElementById("ipAddress").value;
    ConfigureDaemon(ip, true)
  }



  // set interval to get logs
  setInterval(async () => {
    const logs = GetLoggingMoonlight();
    if (logs.length > 0) {
      for (let i = 0; i < logs.length; i++) {
        const log = logs[i];
        const logDiv = document.getElementById("moonlightLog");
        if (logDiv == null)
            continue
        logDiv.innerHTML = logDiv.innerHTML + log.message + "<br>" + "<hr class='solid'></hr>";
      }
    }
    const ip = document.getElementById("ipAddress").value;
    if(ip.length > 0){
      const logsServer = await GetServerLog(ip)
      document.getElementById("serverLog").innerHTML = "";
      if (logsServer.length > 0) {
        for (let i = logsServer.length - 1; i >= logsServer.length - 10; i--) {
          console.log(logsServer[i]);
          const log = logsServer[i];
          const logDiv = document.getElementById("serverLog");
          if (logDiv == null)
            continue
          logDiv.innerHTML +=log.timestamp + "|"  + log.log + "<br>" + "<hr class='solid'></hr>";
        }
      }

    }
  }, 500)
});

