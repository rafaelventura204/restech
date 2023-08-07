'use client';
import { Patient } from '@/models/patient';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {

    //Contiene il paziente attualmente attivo
    const [patient, setPatient] = useState<Patient>();

    const params = useSearchParams();

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            const response = await fetch(`/api/oscillometry?Id=${params.get('Id')}`);
            const data = await response.json();

            if (!data.error) {
                setPatient(data);
            }

        } catch (error) {
            console.error('Error fetching oscillometry data:', error);
        }
    }

    //restituisce il colore da visualizzare in base allo zscore
    function getAnomalyStatusColor(zscore: number): string {
        if (zscore > 1.64) return 'red';
        return 'white'
    }


    return (
        <div>
            <h1>Oscillometry Data</h1>

            {/* Table 1: Patient Information */}
            <h2>Patient Information</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Sex</th>
                        <th>Age</th>
                        <th>Height</th>
                        <th>Weight</th>
                        <th>BMI</th>
                    </tr>
                </thead>
                <tbody>
                    {patient &&
                        <tr key={patient.Id}>
                            <td>{patient.Name}</td>
                            <td>{patient.Surname}</td>
                            <td>{patient.Sex}</td>
                            <td>{patient.Age}</td>
                            <td>{patient.Height} cm ({Math.ceil(patient.Height / 2.54)} in)</td>
                            <td>{patient.Weight} kg ({Math.ceil(patient.Weight / 0.45)} lb)</td>
                            {<td>{patient.OscillometryData.BMI} kg/m²</td>}
                        </tr>
                    }
                </tbody>
            </table>

            {/* Table 2: Oscillometry */}
            <h2>Oscillometry</h2>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>LLN</th>
                        <th>Pred</th>
                        <th>ULN</th>
                        <th>Baseline</th>
                        <th>%Pred</th>
                        <th>Z-Score</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Rrs 5 ins</td>
                        <td>{patient?.OscillometryData?.LLN}</td>
                        <td>{patient?.OscillometryData?.Pred}</td>
                        <td>{patient?.OscillometryData?.ULN}</td>
                        <td style={{ backgroundColor: getAnomalyStatusColor(patient?.OscillometryData?.ins['Z-score'] ?? 0) }}>{patient?.OscillometryData?.ins.Baseline}</td>
                        <td style={{ backgroundColor: getAnomalyStatusColor(patient?.OscillometryData?.ins['Z-score'] ?? 0) }}>{patient?.OscillometryData?.ins['%Pred']}%</td>
                        <td style={{ backgroundColor: getAnomalyStatusColor(patient?.OscillometryData?.ins['Z-score'] ?? 0) }}>{patient?.OscillometryData?.ins['Z-score']}</td>
                    </tr>
                    <tr>
                        <td>Rrs 5 exp</td>
                        <td>{patient?.OscillometryData?.LLN}</td>
                        <td>{patient?.OscillometryData?.Pred}</td>
                        <td>{patient?.OscillometryData?.ULN}</td>
                        <td style={{ backgroundColor: getAnomalyStatusColor(patient?.OscillometryData?.exp['Z-score'] ?? 0) }}>{patient?.OscillometryData?.exp.Baseline}</td>
                        <td style={{ backgroundColor: getAnomalyStatusColor(patient?.OscillometryData?.exp['Z-score'] ?? 0) }}>{patient?.OscillometryData?.exp['%Pred']}%</td>
                        <td style={{ backgroundColor: getAnomalyStatusColor(patient?.OscillometryData?.exp['Z-score'] ?? 0) }}>{patient?.OscillometryData?.exp['Z-score']}</td>
                    </tr>
                    <tr>
                        <td>Rrs 5 tot</td>
                        <td>{patient?.OscillometryData?.LLN}</td>
                        <td>{patient?.OscillometryData?.Pred}</td>
                        <td>{patient?.OscillometryData?.ULN}</td>
                        <td style={{ backgroundColor: getAnomalyStatusColor(patient?.OscillometryData?.tot['Z-score'] ?? 0) }}>{patient?.OscillometryData?.tot.Baseline}</td>
                        <td style={{ backgroundColor: getAnomalyStatusColor(patient?.OscillometryData?.tot['Z-score'] ?? 0) }}>{patient?.OscillometryData?.tot['%Pred']}%</td>
                        <td style={{ backgroundColor: getAnomalyStatusColor(patient?.OscillometryData?.tot['Z-score'] ?? 0) }}>{patient?.OscillometryData?.tot['Z-score']}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
