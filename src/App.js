import { click } from '@testing-library/user-event/dist/click';
import './index.css';
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import { ListItem, ListItemText } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Checkbox from '@mui/material/Checkbox';
import { grey } from '@mui/material/colors';
import Chip from '@mui/material/Chip';

function TodoList(props) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minWidth="460px" 
    >
      <List sx={{ width: '70%' }}>
        {props.todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            setCompleted={props.setCompleted}
            deleteTodo={props.deleteTodo}
            editTodo={props.editTodo}
          />
        ))}
      </List>
    </Box>
  );
}

function TodoItem(props) {
  const [editText, setEditText] = useState(props.todo.text);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  let blurTimeout = null;

  const handleEditChange = (event) => {
    setEditText(event.target.value);
  }

  const handleEditClick = () => {
    if (blurTimeout) clearTimeout(blurTimeout);

    if (isEditing) {
      // Only save if the text has changed
      if (editText !== props.todo.text) {
        props.editTodo(props.todo.id, editText);
      }
      setIsEditing(false);
    } else {
      setIsEditing(!isEditing);
    }
  }

  const handleBlur = () => {
    blurTimeout = setTimeout(() => {
      if (isEditing) {
        if (editText !== props.todo.text) {
          props.editTodo(props.todo.id, editText);
        }
        setIsEditing(false);
      }
    }, 100); // 100ms delay before setting isEditing to false
  }

  const handleCheckboxChange = () => {
    props.setCompleted(props.todo.id);
  }

  const deleteTodo = () => {
    props.deleteTodo(props.todo.id);
  }
  
  return (
    <ListItem sx={{ border: 1, borderRadius: 1, borderColor: 'grey.400', marginBottom: 2 }}>
      <ListItemText
        primary= {isEditing ?
          <TextField
            fullWidth
            value={editText}
            onChange={handleEditChange}
            onBlur={handleBlur}
            variant='outlined'
            autoFocus
          />
          :
          props.todo.text
        }
        sx={props.todo.completed ? { textDecoration: 'line-through' } : {} }
      />
      {props.todo.category ? <Chip label={props.todo.category} /> : null }
      <Checkbox checked={props.todo.completed} onChange={handleCheckboxChange}/>
      <IconButton onClick={handleEditClick}>
        <EditIcon />
      </IconButton>
      <IconButton onClick={deleteTodo}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
}

function AddTodoForm(props) {
  const [inputValue, setInputValue] = useState('');
  const options = ["Home", "Work", "Other"];
  const [category, setCategory] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.onAddTodo(inputValue, category);
    setInputValue('');
    setCategory('');
  }

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  
  return (
    <Box 
      sx={{ 
        component: 'form',
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        m: 3,
        minWidth: 460
      }}
    >
      <TextField sx={{ mr: 3, mb: 1, width: '60%' }} id="outlined-basic" label="Task" variant="outlined" value={inputValue} onChange={handleInputChange} />
        
      <FormControl sx={{ minWidth: 115, mr: 3 }}>
        <InputLabel id="category-selection-dropdown-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={category}
          label="Category"
          onChange={handleCategoryChange}
        >
          {options.map(option => (
            <MenuItem value={option}>{option}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button sx={{ pl: 3, pr: 3, mt: 2 }} variant="contained" type="submit" onClick={handleSubmit}>
        Add
      </Button>
    </Box>
  )
}

export default function App() {
  
  const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
  const [todos, setTodos] = useState(savedTodos);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  function handleAddTodo(todoText, todoCategory) {
    // Set the completed status
    const isCompleted = false;

    // Create a new todo object
    const newTodo = {
      id: uuidv4(),
      text: todoText,
      category: todoCategory,
      completed: isCompleted
    };

    setTodos([...todos, newTodo]);
  }

  function setCompleted(clickedTodoId) {
    const newTodos = todos.map(todo => {
      if (todo.id === clickedTodoId) {
        // Toggle the completed status of this todo
        return {...todo, completed: !todo.completed};
      }
      return todo;
    });

    setTodos(newTodos);
  }

  function deleteTodo(clickedTodoId) {
    const newTodos = todos.filter(todo => todo.id !== clickedTodoId);

    setTodos(newTodos);
  }

  function editTodo(clickedTodoId, newText) {
    const newTodos = todos.map(todo => {
      if (todo.id === clickedTodoId) {
        return {...todo, text: newText}
      }
      return todo;
    });

    setTodos(newTodos);
  }
  
  return (
    <div className="App">
      <AddTodoForm onAddTodo={handleAddTodo} />
      <TodoList todos={todos} setCompleted={setCompleted} deleteTodo={deleteTodo} editTodo={editTodo}/>
    </div>
  );
}
