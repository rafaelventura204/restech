'use client';
import './globals.css'
import { Patient } from '@/models/patient';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

export default function Home() {

  //Contiene il paziente attualmente attivo
  const [patient, setPatient] = useState<Patient>();
  //Valore del campo di ricerca
  const [inputFieldValue, setInputFieldValue] = useState<number>(1);
  const router = useRouter();

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const response = await fetch(`/api/oscillometry?Id=${inputFieldValue}`);
      const data = await response.json();
      setPatient(data);
    } catch (error) {
      console.error('Error fetching oscillometry data:', error);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`http://localhost:3000/oscillometry?Id=${inputFieldValue}`)
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    setInputFieldValue(event.target.valueAsNumber);
  }

  return (

    <div>
      <h1>Oscillometry Data</h1>
      {/* FORM PER SELEZIONARE IL PAZIENTE DA VISUALIZZARE */}
      <form onSubmit={onSubmit} >
        <label>ID paziente</label>
        <input value={inputFieldValue} onChange={onInputChange} type='number' step={1} name='Id'></input>
        <button formAction="submit">cerca</button>
      </form>
    </div>
  );
}
