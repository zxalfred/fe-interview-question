import Observe from './Observe.js'
import Watcher from './Watcher.js'

let obj = {
    name: 'xiaoming',
    detail: [
        {
            subject: 'math',
            score: 90
        }
    ],
    data: {
        name:123
    }
}
const temp = new Observe(obj)

new Watcher(() => {
    console.log('tem.name effect =====>', temp.name)
})

new Watcher(() => {
    console.log('temp.detail effect =====>', temp.detail)
})

new Watcher(() => {
    console.log('temp.data.name effect =====>', temp.data.name)
})

temp.data.name = 234

temp.detail.push({
    subject: 'English',
    score: 60
})

temp.detail[1].score = 20

temp.name = '123'