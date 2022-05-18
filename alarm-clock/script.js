function uniqueID(){
    return Math.floor(Math.random()*Date.now())
}

const formatTime = (time) => {
    const newTime = new Date(time).setMilliseconds(0);
    return new Date(newTime).setSeconds(0)
}
class Clock{

    constructor(){
        this.alarms = []
        /*
        [{
            id: uniqueID,
            time: "",
            on: true,
            snoozeRemaining:3
        },{}]

        */
    }

    getAlarms(){
        return this.alarms;
    }

    setAlarm(time){
        const alarmInstance = {
            id: uniqueID(),
            time: formatTime(time),
            on: true,
            snoozeRemaining: 3
        }
        this.alarms.push(alarmInstance)

        refreshAlarmsInUI();
    }

    deleteAlarm(id){
        this.alarms = this.alarms.filter((alarm)=> alarm.id!==id)
        refreshAlarmsInUI()
    }

    snoozeAlarm(id, cancel=false){
        this.alarms.map((alarm)=>{
            if(id===alarm.id){

                const para = document.getElementById(id).getElementsByTagName("p")[0];

                if(alarm.snoozeRemaining===0 || cancel){
                    para.innerText = "Cancelling alarm for today"

                    const newTime = Date.now(alarm.time) + 7*24*60*60*1000 - 5*(3-alarm.snoozeRemaining)*60*1000;
                    alarm.time = formatTime(new Date(newTime))
                    alarm.snoozeRemaining=3;
                }else{
                    para.innerText = "Snoozing for 5 mins"

                    const newTime = Date.now(alarm.time) + 5*60*1000;
                    alarm.time = formatTime(new Date(newTime))
                    alarm.snoozeRemaining = alarm.snoozeRemaining-1;
                }
                setTimeout(()=>refreshAlarmsInUI(),2000)
            }
            return alarm;
        })
    }

    playAlarm(id){
        console.log(`Alarm with id ${id} is playing`)
    }
}



const clock = new Clock()

const isTimeSame = (time1,time2) => {
    if(formatTime(new Date(time1))=== formatTime(new Date(time2))){
        return true;
    }else{
        return false;
    }
}
setInterval(function(){
    const alarms = clock.getAlarms();
    alarms.forEach((alarm)=>{
        if(isTimeSame(alarm.time,new Date())){
            clock.playAlarm(alarm.id)
            const elem = document.getElementById(alarm.id);
            const para = document.createElement("p");
            para.innerText="Ringing"
            elem.appendChild(para)
            window.addEventListener("keydown",(e)=>handleSnoozeCancel(e,alarm.id,elem),{once:true})
        }
    })
},60*1000)

function handleSnoozeCancel(e,alarmId,elem){
    const snoozeOrCancel = e.key;

    if(snoozeOrCancel==="s"){
        clock.snoozeAlarm(alarmId)
    }else if(snoozeOrCancel==="c"){
        clock.snoozeAlarm(alarmId,true)
    }else{
        window.alert("Invalid Response, snoozing the alarm for 5 mins")
        clock.snoozeAlarm(alarmId)
    }
}

const addAlarmBtn = document.getElementById("submit")
const alarmDay = document.getElementById("day")
const alarmTime = document.getElementById("time")
const alarms = document.getElementById("alarms")

addAlarmBtn.addEventListener("click",function(){
    console.log(alarmTime.value,alarmDay.value)

    const hh = parseInt(alarmTime.value.split(":")[0])
    const min = parseInt(alarmTime.value.split(":")[1])

    const currDate = new Date().getDate()
    const currDay = new Date().getDay()
    const currHours = new Date().getHours()
    const currMins = new Date().getMinutes()
    const currYear = new Date().getFullYear()
    const currMonth = new Date().getMonth()

    let date = currDate - currDay + parseInt(alarmDay.value)
    if(date<currDate || (date===currDate && (hh<currHours || (hh===currHours && min<=currMins)))){
        date=date+7
    }
    let timeForAlarm = new Date(currYear,currMonth,date, hh,min,0,0);
    clock.setAlarm(timeForAlarm)

})

const refreshAlarmsInUI = () => {
    alarms.innerHTML = "";

    const sortedAlarms = clock.getAlarms().sort(function(a,b){
        return new Date(a.time) - new Date(b.time)
    })


    sortedAlarms.forEach((alarm)=>{
        addAlarmToUI(alarm.time,alarm.id)
    })
}

const addAlarmToUI = (timeForAlarm,id) => {
    const day = new Date(timeForAlarm).getDay()
    const timeHH = new Date(timeForAlarm).getHours()
    const timeMin = new Date(timeForAlarm).getMinutes()
    const alarmEl = document.createElement("div")
 
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

    const dayName = days[day];

    alarmEl.innerHTML = `<h3 id=${id}>
        ${alarms.childElementCount +1}. ${dayName} ${timeHH.toString().padStart(2,"0")}:${timeMin.toString().padStart(2,"0")}
    </h3>
    <p>Next Alarm on ${new Date(timeForAlarm)}</p>
    `
    alarms.appendChild(alarmEl)
}