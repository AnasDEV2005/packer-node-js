/*
PROGRAM LOGIC:
                                                                        
    1. Get the values through filepath                                
    2. Parse the values for every package                             
    3. Apply pre-defined conditions to every package item
    4. Generate all possibilities for every package    
    5. Get the most valuable combination
    6. Choose candidate for every package
    7. Output the items indexes for every package as csv format



*/
// Importing the function that is supposed to read the file.
import {
  readFile
} from 'fs'




console.log('Here is the required syntax in order for the program to function properly: \n    -Every package has to be written on a different line \n    -The weight limit and the contents of every package have to be separated by a \':\' \n    -Every Item has to be seperated by a space and enclosed within \'()\'\n    -The weight, index number, and cost of the item have to all be separated by commas, the currency sign comes before the cost.\n \n Please know that any item that doesn\'t use the proper syntax will be ignored.\n')




function getCombinations(items) {

  var combi = [];
  var temp = [];
  var slent = Math.pow(2, items.length);

  for (var i = 0; i < slent; i++) {
    temp = [];
    for (var j = 0; j < items.length; j++) {
      if ((i & Math.pow(2, j))) {
        temp.push(items[j]);
      }
    }
    if (temp.length > 0) {
      combi.push(temp);
    }
  }

  combi.sort((a, b) => a.length - b.length);
  return combi;
}

function getNominatedCombination(aggregatedCombinations) {

  // eliminate all combinations that are not equal in cost to the first combination (sorted desc)
  // Sort By weight (asc)
  // Pick first of array. 

  if (aggregatedCombinations.length === 0) return null

  const combinationsSortedByCostDesc = [...aggregatedCombinations].sort((a, b) => b.totalCost - a.totalCost)
  const firstComb = combinationsSortedByCostDesc[0]

  let winner = firstComb

  combinationsSortedByCostDesc.forEach((x, index) => {
    if (x.totalCost != firstComb.totalCost) {
      combinationsSortedByCostDesc.splice(index, 1)

    } else {
      winner = combinationsSortedByCostDesc[index]

    }
  })

  const combinationsSortedByWeightAsc = [...combinationsSortedByCostDesc].sort((a, b) => a.totalWeight - b.totalWeight)


  return winner


}

function aggregateCombinations(items) {

  /*
  Return Interface:
    {
      totalCost: number,
      totalWeight: number,
      indexes: number[],
    }
  */

  return {
    totalCost: items.reduce((a, c) =>
      a + c.itemCost, 0),
    totalWeight: items.reduce((a, c) =>
      a + c.itemWeight, 0),
    indexes: items.map(x => x.itemIndex),
  }

}


function findBestCombination(items, packageWeightLimit) {

  // Creating a variable (const) inside of which the items are sorted from higher to lower costs
  // sortedItemsByCost is going to be the index number of the item in the array

  const sortedItemsByCost = items.sort((a, b) => b.itemCost - a.itemCost);
  let internalLimit = packageWeightLimit
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////////////////////////////

}


class CustomError extends Error {
  constructor(message) {

    super()
    this.message = message;
    this.name = "APIExeption"; 

    if ( 'captureStackError' in Error) {
      
      Error.captureStackTrace(this, CustomError)
    } else {
      this.stack = new Error()?.stack
    }
  } 
}

class Packer {

  pack(filePath) {


    return new Promise((resolve, reject)=> 
      readFile(filePath, 'utf8', (err, data) => {

        if (err) return reject(!err?.length? new CustomError("file not found") : new CustomError(err) )
        

        // Checking the data for syntax errors.

        if (data.replace(/\r/g, '').match(/(\d+\s?\:\s?(\(\d+\s?\,\s?\d+\.?\d+\s?\,\s?.\d+\)[\s\\n]?){1,}){1,}/gm)?.length < data.split('\\r\n')?.length) return  reject(new CustomError('Please make sure you use the proper syntax/format'))


        // Splitting the packages everytime a new line is made


        const packages = data.split('\n').filter(item => item.length > 0)
        
        

        // To check if the character ':' is used properly, or else, throw error.

        if ( packages.length > data?.match(/\d+\s?\:\s?\(\d+/gm)?.length ) return reject(new CustomError('Invalid format: expected \' WeightLimit : ( Index, Weight, Cost)\'')) 
        
        // Loop to split the package in two: the weight limit and the items

        const splitPackages = packages.map(item => {

          const [packageWeightLimit, items] = item.split(/\s?\:\s?/gm) || []

          // Testing for space

          if (/\)\S+/gm.test(item))  return reject(new CustomError('Invalid format: expected \'space\'')) 
          
          // Split items (space separated)

          const rawItems = items.split(' ')

//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                                                                                           //  |   
//          // My try at Testing for Parenthesis                                                                                                                 |
//                                                                                                                                                        //    |
          // if (/\(.+\)/gm.test(rawItems))  return reject(new CustomError('Invalid format: expected item to be enclosed in: \'()\''))                         |
//-------------------------------------------------------------------------------------------------------------------------------------------------------------|
          // Split each item (csv format)

          const parsedItems = rawItems.map(x => {
            // Separating the item index, weight and cost from each other and 
            // eliminating special characters so that only numbers remain

            const [_, itemIndex, itemWeight, itemCost] = /^\((\d+)\,([\d\.]+)\,\W?([\d\.]+)\)/gm.exec(x) || []

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX            
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

            // Converting the index, cost and weight values from string to float/int (number) 



              return {

              itemIndex: parseInt(itemIndex),
              itemCost: parseFloat(itemCost),
              itemWeight: parseFloat(itemWeight),


            }

            // example of x: (1,53.38,€45)


            return {
              itemIndex,
              itemWeight,
              itemCost
            }
          })
          // Converting the weight limit to a float


          const parsedWeightlimit = parseFloat(packageWeightLimit)

          //------------------------------------------------------------------------------------------------
          
          
          
          if (parsedWeightlimit > 100) return null

          

          const filteredItems = parsedItems
            .filter(x =>
              x.itemWeight <= 100 && x.itemCost <= 100)
            .slice(0, 14)



          //-------------------------------------------------------------------------------------------
          // Calling the function and making the list of combinations an array named combinations, 
          // while using filtered items as the items.


          const combinations = getCombinations(filteredItems)


          //----------------------------------------------------------------------------------------------------
          // Mapping the combination costs so that each combination has a list of costs


          const aggregatedCombinations = combinations

            .map(x => aggregateCombinations(x))
            .filter(x =>
              x.totalWeight <= 100 && x.totalWeight <= parsedWeightlimit)

          const nominatedCombination = getNominatedCombination(aggregatedCombinations)

          const stringifiedValue = !!nominatedCombination ? nominatedCombination.indexes.join(',') : '-'

          return !nominatedCombination?.indexes ? 
            null:
            nominatedCombination.indexes

        })


        return resolve(splitPackages.map(x=> 
          !x?.length ? 
            '-':
            x).join('\n') )



      }))
    

  }
}


export { Packer }