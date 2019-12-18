import { eventKeyboards, counterFilters, dataActions  } from './utils/Contants.js'

function TodoList(selector) {
  const { ALL } = counterFilters

  this.items = []
  this.className = ALL
  this.$todoList = document.querySelector(selector)
  this.$filters = document.querySelector('ul.filters')

  this.$filters.addEventListener('click', (e) => {
    if(e.target === this.$filters) return 

    const aTags = document.querySelectorAll('ul.filters li a')
    for(const tag of aTags) tag.classList.remove('selected')
    
    this.className = e.target.className
    e.target.classList.add('selected')

    this.renderByFilter(this.className)
  })

  this.$todoList.addEventListener('click', (e) => {
    const { CHECK, REMOVE } = dataActions
    const datasetAction = e.target.dataset.action
    if(!datasetAction) return 

    const [action, id] = datasetAction.split('-')
    switch(action) {
      case CHECK: this.toggleState(id); break
      case REMOVE: this.removeState(id); break
    }
  })

  this.$todoList.addEventListener('dblclick', (e) => {
    const { EDIT } = dataActions
    const datasetAction = e.target.dataset.action
    if(!datasetAction) return 

    const [action, id] = datasetAction.split('-')
    switch(action) {
      case EDIT: this.toggleEditView(id); break
    } 
  })
}

TodoList.prototype.renderByFilter = function(filter) {
  const { ACTIVE, COMPLETED } = counterFilters
  switch(filter) {
    case ACTIVE: this.renderActive(this.items); break
    case COMPLETED: this.renderCompleted(this.items); break
    default: this.render(this.items)
  }
}

TodoList.prototype.renderActive = function(items) {
  const activeItems = items.filter((item) => !item.completed)
  this.render(activeItems) 
}

TodoList.prototype.renderCompleted = function(items) {
  const completedItems = items.filter((item) => item.completed)
  this.render(completedItems) 
}

TodoList.prototype.render = function(items) {
  const { CHECK, REMOVE, EDIT } = dataActions
  const itemsHtmlString = items.reduce((acc, item) => {
    const { id, content, completed } = item
    const inputHtmlString = `<input class="toggle" type="checkbox" data-action=${CHECK}-${id} ${completed && 'checked'}>`
    const labelHtmlString = `<label class="label" data-action=${EDIT}-${id}>${content}</label>`
    const buttonHtmlString = `<button class="destroy" data-action=${REMOVE}-${id}></button>`
    const viewHtmlString = `<div class="view">${inputHtmlString}${labelHtmlString}${buttonHtmlString}</div>`
    const liHtmlString = `<li ${completed && 'class="completed"'} data-action=${EDIT}-${id}>${viewHtmlString}<input class="edit" value="${content}"></li>`
    return `${acc}${liHtmlString}`
  }, '')

  this.$todoList.innerHTML = itemsHtmlString
  this.renderCounterContainer(items)
}

TodoList.prototype.renderCounterContainer = function(items) {
  const $countContainerSpanComponent = document.querySelector('div.count-container > span')
  $countContainerSpanComponent.innerHTML = `총 <strong>${items.length}</strong> 개`
}

TodoList.prototype.addItem = function(item) {
  this.items.push(item)
  this.renderByFilter(this.className)
}

TodoList.prototype.toggleState = function(id) {
  this.items = this.items.map((item) => id == item.id ? ({...item, completed: !item.completed}) : ({...item}))
  this.renderByFilter(this.className)
}

TodoList.prototype.removeState = function(id) {
  this.items = this.items.filter((item) => id != item.id)
  this.renderByFilter(this.className)
}

TodoList.prototype.toggleEditView = function(id) {
  const $liElement = document.querySelector(`li[data-action=edit-${id}]`)
  const $inputElement = $liElement.querySelector('input.edit')
 
  $liElement.classList.add('editing')

  $inputElement.addEventListener('keydown', (e) => {
    const { ENTER, ESC } = eventKeyboards
    switch(e.key) {
      case ESC: this.render(this.items); break
      case ENTER: this.editContent(id, e.target.value); break
    }
  })
}

TodoList.prototype.editContent = function(id, content) {
  this.items = this.items.map((item) => item.id == id ? {...item, content} : {...item})
  this.renderByFilter(this.className)
}

export default TodoList