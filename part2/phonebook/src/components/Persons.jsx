const Person = ({ person, onDelete }) => {
  return (
    <p>
      {person.name} {person.number}
      <button onClick={onDelete}>delete</button>
    </p>
  )
}

const Persons = ({ persons, onDelete }) => {
  return (
    <div>
      {persons.map(person =>
        <Person
          key={person.id}
          person={person}
          onDelete={() => onDelete(person.id, person.name)}
        />
      )}
    </div>
  )
}

export default Persons