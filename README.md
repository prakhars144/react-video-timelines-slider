### react-video-timelines-slider
This project is forked from **react-timeline-range-slider** by [lizashkod](https://github.com/lizashkod) and it adds more functionality and security updates. The additional functionality includes support for
tooltips, tooltip format, enabling-disabling tooltip and hiding timeline error if gap is selected.

### Live demo
[codesandbox-demo](https://codesandbox.io/s/react-video-timelines-slider-0skcll?file=/src/App.js)

### Installation-steps

     npm i react-video-timelines-slider
### Props

| Prop | Type | Default | Description|
|--|--|--|--|
| timelineInterval | array |[startOfToday(), endOfToday()]|Interval to display|
|selectedInterval|array|[new Date(), addHours(new Date(), 1)]|Selected interval inside the timeline|
|disabledIntervals|array|[]|Array of disabled intervals inside the timeline|
|containerClassName|string||ClassName of the wrapping container|
|step|number|1800000|Number of milliseconds between steps (the default value is 30 minutes)|
|ticksNumber|number|48|Number of steps on the timeline (the default value is 30 minutes)|
|error|bool|false|Is the selected interval is not valid|
|mode|int/function|3|The interaction mode. Value of 1 will allow handles to cross each other. Value of 2 will keep the sliders from crossing and separated by a step. Value of 3 will make the handles pushable and keep them a step apart. ADVANCED: You can also supply a function that will be passed the current values and the incoming update. Your function should return what the state should be set as.|
|formatTick|function|ms => format(new Date(ms), 'HH:mm')|Function that determines the format in which the date will be displayed|
|formatTooltip|function|ms => format(new Date(ms), 'HH:mm:ss')|Function that determines the format in which the tooltip will be displayed|
|showTooltip|bool|true|enable-disable the tooltip|
|tooltipTag|string|"Value:"|Tag to appear before tooltip text|
|showTimelineError|bool|false|Turn timeline red if range with gap is selected|
|onUpdateCallback|function|||
|onChangeCallback|function|||

```javascript
import React from 'react'  
import { endOfToday, set } from 'date-fns' 
import TimeRange from 'react-video-timelines-slider'  

const now = new Date()
const getTodayAtSpecificHour = (hour = 12) =>
	set(now, { hours: hour, minutes: 0, seconds: 0, milliseconds: 0 })

const selectedStart = getTodayAtSpecificHour()
const selectedEnd = getTodayAtSpecificHour(14)

const startTime = getTodayAtSpecificHour(7)
const endTime = endOfToday()

const disabledIntervals = [
  { start: getTodayAtSpecificHour(16), end: getTodayAtSpecificHour(17) },
  { start: getTodayAtSpecificHour(7), end: getTodayAtSpecificHour(12) },
  { start: getTodayAtSpecificHour(20), end: getTodayAtSpecificHour(24) }
]

class App extends React.Component {  
  state = {  
    error: false,  
    selectedInterval: [selectedStart, selectedEnd],  
  }
	
  errorHandler = ({ error }) => this.setState({ error })  

  onChangeCallback = selectedInterval => this.setState({ selectedInterval })  

  render() {  
    const { selectedInterval, error } = this.state  
      return (  
        <TimeRange
          error={error}  
          ticksNumber={20}  
          step={1}
          selectedInterval={selectedInterval}  
          timelineInterval={[startTime, endTime]}  
          onUpdateCallback={this.errorHandler}  
          onChangeCallback={this.onChangeCallback}
          disabledIntervals={disabledIntervals} 
          formatTick={(ms) => format(new Date(ms), 'HH:mm:ss')} 
          formatTooltip={(ms) => format(new Date(ms), 'HH:mm:ss.SSS')}
          showTooltip={true}
          showTimelineError={false}
        />
      )  
  }  
}  

export default App
```
