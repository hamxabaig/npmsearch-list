const Fuse = require('fuse.js')

module.exports = (hint, list) => {
  return new Promise(resolve => {
    if (!hint) {
      return resolve(list);
    }
    const mappedList = list.map(h => ({ command: h }))
    const options = { keys: ['command'] }

    const fuse = new Fuse(mappedList, options)
    const matchingList = fuse.search(hint)

    let choices = matchingList.map(h => h.command);
    choices = choices.filter((c) => c);
    resolve(choices);
  })
}
