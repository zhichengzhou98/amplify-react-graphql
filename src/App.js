import React , { useState, useEffect } from 'react';
import './App.css';

// import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { listTodos } from './graphql/queries';
import { createTodo , deleteTodo } from './graphql/mutations';


import { API, Storage } from 'aws-amplify';

const initialFormState = { name: '', description: '' }

function App() {
  // const { signOut } = useAuthenticator((context) => [context.user]);

  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);
  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchNotes();
  }


  async function fetchNotes() {
    const apiData = await API.graphql({ query: listTodos });
    const notesFromAPI = apiData.data.listTodos.items;
    await Promise.all(notesFromAPI.map(async note => {
      if (note.image) {
        const image = await Storage.get(note.image);
        note.image = image;
      }
      return note;
    }))
    setNotes(apiData.data.listTodos.items);
  }



  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createTodo, variables: { input: formData } });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteTodo, variables: { input: { id } }});
  }

  return (
    <div className="App">
      <header>
        <h1>We now have Auth!</h1>
      </header>

      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Note name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Note description"
        value={formData.description}
      />
      <button onClick={createNote}>Create Note</button>
      <div style={{marginBottom: 30}}>
        {
          notes.map(note => (
            <div key={note.id || note.name}>
              <h2>{note.name}</h2>
              <p>{note.description}</p>
              <button onClick={() => deleteNote(note)}>Delete note</button>
            </div>
          ))
        }
      </div>
      <input
  type="file"
  onChange={onChange}
/>
{
  notes.map(note => (
    <div key={note.id || note.name}>
      <h2>{note.name}</h2>
      <p>{note.description}</p>
      <button onClick={() => deleteNote(note)}>Delete note</button>
      {
        note.image && <img src={note.image} style={{width: 400}} />
      }
    </div>
  ))
}

      {/* <button onClick={signOut}>login out</button> */}
    </div>
  );
}

// export default withAuthenticator(App);
export default (App);