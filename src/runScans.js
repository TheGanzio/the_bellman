import { getPostsUnian, parseLinksUnian } from './scans/parseNewUnian.js'
import { getPostsHromadske, parseLinksHromadske } from './scans/parseNewHromadske.js'
import { getPostsKoresp, parseLinksKoresp} from './scans/parseNewKoresp.js'
import { getPostsKorona, parseLinksKorona} from './scans/parseNewKorona.js'
import fs from 'fs'
import axios from 'axios'
import mongoose from 'mongoose'

mongoose.connect('mongodb+srv://Nikolaiev:newsagregator@cluster0.qcstf.azure.mongodb.net/thebellman?retryWrites=true&w=majority', 
{
      useNewUrlParser: true, 
})
.then(() => console.log('MongoDB is connected'))
.catch((err) => console.log(err))

const PostsSchema = new mongoose.Schema({
  url: String,
  title: String,
  preDescription: String,
  description: String,
  authorName: String,
  image: String
})

const Ukraine = mongoose.model('Ukraine', PostsSchema)
const IT = mongoose.model('IT', PostsSchema)
const World = mongoose.model('World', PostsSchema)
const Korona = mongoose.model('Korona', PostsSchema)
let date = ''


function getData() {

   const saveResultHromadske = json => {
    Ukraine.deleteMany({}).then(() => console.log('Ukraine posts are deleted')).catch(e => console.log(e))
    console.log(json)
    Ukraine.insertMany(JSON.parse(json), err => {
        console.log('Saved!')
        if (err) console.log(err)
      })
    }
    
    const saveResultUnian = json => {
      IT.deleteMany({}).then(() => console.log('IT posts are deleted')).catch(e => console.log(e))
      console.log(json)
      IT.insertMany(JSON.parse(json), err => {
          console.log('Saved!')
          if (err) console.log(err)
        })
    }

    const saveResultKoresp = json => {
      World.deleteMany({}).then(() => console.log('World posts are deleted')).catch(e => console.log(e))
      console.log(json)
      World.insertMany(JSON.parse(json), err => {
          console.log('Saved!')
          if (err) console.log(err)
        })
    }

    const saveResultKorona = json => {
        Korona.deleteMany({}).then(() => console.log('Korona posts are deleted')).catch(e => console.log(e))
        console.log(json)
        Korona.insertMany(JSON.parse(json), err => {
            console.log('Saved!')
            if (err) console.log(err)
          })
      }
    
    parseLinksHromadske('https://www.obozrevatel.com/ukr/location/ukraina/', '.section_content.--related a')
    .then(links => {
        getPostsHromadske(links).then(posts => saveResultHromadske(JSON.stringify(posts, 0, 4))).catch(e => console.log(e))
    })
    .catch(e => console.log(e))
    
    parseLinksUnian('https://www.unian.ua/science', '.list-thumbs a')
    .then(links => {
        getPostsUnian(links).then(posts => saveResultUnian(JSON.stringify(posts, 0, 4))).catch(e => console.log(e))
    })
    .catch(e => console.log(e))

    parseLinksKoresp('https://ua.korrespondent.net/all/world/2021/', '.articles-list a')
    .then(links => {
        getPostsKoresp(links).then(posts => saveResultKoresp(JSON.stringify(posts, 0, 4))).catch(e => console.log(e))
    })
    .catch(e => console.log(e))

    parseLinksKorona('https://ua.korrespondent.net/special/2092-koronavirus', '.articles-list a')
    .then(links => {
        getPostsKorona(links).then(posts => saveResultKorona(JSON.stringify(posts, 0, 4))).catch(e => console.log(e))
    })
    .catch(e => console.log(e))

    date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    console.log(date)

}

getData()

setInterval(getData, 1500000)


export { getData }
export default date