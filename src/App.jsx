import { useState, useEffect } from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'

import Column from './components/Column'
import './App.css'

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('kanbanTasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })
  const [inputValue, setInputValue] = useState('')
  const [priority, setPriority] = useState('medium')
  const [searchQuery, setSearchQuery] = useState('')

  // Load tasks from localStorage
  
const handleDragEnd = (event) => {
  const { active, over } = event

  if (!over) return

  const taskId = active.id
  const newStatus = over.id

  setTasks((prevTasks) =>
    prevTasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    )
  )
}

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (inputValue.trim() === '') {
      alert('Please enter a task!')
      return
    }

    const newTask = {
      id: Date.now().toString(),
      text: inputValue,
      status: 'todo',
      priority: priority
    }

    setTasks([...tasks, newTask])
    setInputValue('')
    setPriority('medium')
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const moveTask = (id, newStatus) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: newStatus } : task
    ))
  }

  const editTask = (id, newText) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: newText } : task
    ))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask()
    }
  }

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const todoTasks = filteredTasks.filter(task => task.status === 'todo')
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress')
  const doneTasks = filteredTasks.filter(task => task.status === 'done')

  return (
    <div className="app">
      <h1>📋 Kanban Board</h1>

      <div className="search-section">
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter a new task..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="priority-select"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>
<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
  <div className="board">

        <Column
          title="To Do"
          status="todo"
          tasks={todoTasks}
          onDelete={deleteTask}
          onMove={moveTask}
          onEdit={editTask}
        />
        <Column
          title="In Progress"
          status="in-progress"
          tasks={inProgressTasks}
          onDelete={deleteTask}
          onMove={moveTask}
          onEdit={editTask}
        />
        <Column
          title="Done"
          status="done"
          tasks={doneTasks}
          onDelete={deleteTask}
          onMove={moveTask}
          onEdit={editTask}
        />
        </div>
</DndContext>
    </div>
  )
}

export default App
