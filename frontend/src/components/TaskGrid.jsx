import {Grid} from '@chakra-ui/react';
import {TASKS} from '../Tasks/dummy.js';
import TaskCard from './TaskCard.jsx';

const TaskGrid = () => {
    return (
        <Grid templateColumns = {{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
        
        }} gap={6}
        >
            {/* Task Cards */}
            {TASKS.map((task) => (
                
                <TaskCard key={task.id} task={task} />
            ))}
        </Grid>
    )
}
export default TaskGrid;