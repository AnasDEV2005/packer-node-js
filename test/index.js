
import { resolve } from 'path'
import { cwd } from 'process'

import { Packer } from '../src/index.js'

;(async ()=> {
  

  const filePath = resolve(cwd(), 'test\\index-1.txt');
  try{
    const program = new Packer()
    console.log( await program.pack(filePath))
  } catch(e) {
    console.log('SYNTAX__ERROR_DETECTED_ ', JSON.stringify(e))
  }

})()
