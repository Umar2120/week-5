import { useState } from 'react'
import '../styles/Card.css'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

const Card = ({ task, onDelete, onMove, onEdit, columnStatus }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(task.text)

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id
  })

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined
  }

  const getColumnColor = (status) => {
    const map = {
      'todo': '#f81111',
      'in-progress': '#fcd53b',
      'done': '#1adf41'
    }
    return map[status] || '#ffffff'
  }

  const hexToRgba = (hex, alpha = 1) => {
    const clean = hex.replace('#', '')
    const r = parseInt(clean.length === 3 ? clean[0] + clean[0] : clean.substring(0,2), 16)
    const g = parseInt(clean.length === 3 ? clean[1] + clean[1] : clean.substring(2,4), 16)
    const b = parseInt(clean.length === 3 ? clean[2] + clean[2] : clean.substring(4,6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const columnColor = getColumnColor(columnStatus)

  const getColumnTextColor = (status) => {
    const map = {
      'todo': '#ffffff',
      'in-progress': '#f9f5f5',
      'done': '#ffffff'
    }
    return map[status] || '#000000'
  }

  const columnTextColor = getColumnTextColor(columnStatus)

  const getMoveOptions = () => {
    const moves = []
    if (task.status !== 'in-progress') moves.push({ status: 'in-progress', label: '→ In Progress' })
    if (task.status !== 'done') moves.push({ status: 'done', label: '→ Done' })
    if (task.status !== 'todo') moves.push({ status: 'todo', label: '← To Do' })
    return moves
  }

  const handleSaveEdit = () => {
    if (editText.trim() !== '') {
      onEdit(task.id, editText)
      setIsEditing(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSaveEdit()
    else if (e.key === 'Escape') {
      setIsEditing(false)
      setEditText(task.text)
    }
  }

  const getPriorityStyles = () => {
    const styles = {
      high: { backgroundColor: '#ff2525', textColor: '#ffffff' },
      medium: { backgroundColor: '#ffd93d', textColor: '#333333' },
      low: { backgroundColor: '#23e74a', textColor: '#ffffff' }
    }
    return styles[task.priority] || styles.medium
  }

  const priorityStyles = getPriorityStyles()

  return (
    <div
      ref={setNodeRef}
      className="card"
      style={{ ...style, background: `linear-gradient(180deg, ${hexToRgba(columnColor, 0.44)}, ${hexToRgba(columnColor, 0.68)})`, opacity: 0.98, color: columnTextColor }}
    >
      <div
        className="drag-handle"
        title="Drag"
        {...attributes}
        {...listeners}
      >
        ☰
      </div>

      {isEditing ? (
        <div className="card-edit">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
            className="edit-input"
          />
          <button
            className="btn btn-save"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.preventDefault(); e.stopPropagation(); handleSaveEdit()
            }}
          >
            Save
          </button>
          <button
            className="btn btn-cancel"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation(); setIsEditing(false); setEditText(task.text)
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div className="card-content" onClick={() => setIsEditing(true)} title="Click to edit" style={{ color: columnTextColor }}>
            {task.text}
          </div>

          <div className="priority-badge" style={{ backgroundColor: priorityStyles.backgroundColor, color: priorityStyles.textColor }}>
            {task.priority.toUpperCase()}
          </div>

          <div className="card-buttons">
            <button
              className="btn btn-delete"
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onDelete(task.id) }}
              title="Delete task"
            >
              ✕
            </button>

            {getMoveOptions().map(option => (
              <button
                key={option.status}
                className="btn btn-move"
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); onMove(task.id, option.status) }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Card
