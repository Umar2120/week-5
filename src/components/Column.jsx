import Card from './Card'
import { useDroppable } from '@dnd-kit/core'
import '../styles/Column.css'



const Column = ({ title, status, tasks, onDelete, onMove, onEdit }) => {

const { setNodeRef } = useDroppable({
  id: status,
  
})

  return (
    
    <div ref={setNodeRef} className={`column ${status}`}>
      <h2 className="column-title">{title}</h2>
      <div className="cards-container">
        {tasks.map(task => (
          <Card
            key={task.id}
            task={task}
            columnStatus={status}
            onDelete={onDelete}
            onMove={onMove}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  )
}

export default Column