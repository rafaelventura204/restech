'use client';

import '@/app/globals.css';
import { Patient } from '@/models/patient';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function Home() {

    //Contiene il paziente attualmente attivo
    const [patient, setPatient] = useState<Patient>();

    const params = useSearchParams();

    useEffect(() => {
        fetchData();
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
        if (zscore > 1.64) return '#f24b4b';
        return 'white'
    }

    return (
        <div id="main_container">
            {patient ? (
                <>
                    <div id="space_btw_block"></div>
                    <div id="table_name" style={{ top: '7%', left: '20%', }}>Patient Information</div>
                    <div style={{ display: "grid", gridTemplateColumns: "auto auto", border: "solid", width: "80%", padding: '10px' }}>
                        <div>
                            <p style={{ color: 'blue' }}><strong style={{ color: 'black' }}>Name:</strong> {patient.Name} {patient.Surname}</p>
                            <p><strong>Sex:</strong> {patient.Sex}</p>
                            <p><strong>Age:</strong> {patient.Age}</p>
                        </div>
                        <div>
                            <p><strong>Height:</strong> {patient.Height} cm ({Math.ceil(patient.Height / 2.54)} in)</p>
                            <p><strong>Weight:</strong> {patient.Weight} kg ({Math.ceil(patient.Weight / 0.45)} lb)</p>
                            <p><strong>BMI:</strong> {patient.OscillometryData.BMI} kg/m²</p>
                        </div>
                    </div>
                </>
            ) : (
                <p>No patient information available.</p>
            )}
            <div id="space_btw_block"></div>
            <div id="table_name" style={{ top: '32%', left: '20%' }}>
                Oscillometry
            </div>

            <table id="main_table">
                <colgroup>
                    <col id="border_colgroup" />
                    <col id="border_colgroup" />
                    <col id="border_colgroup" />
                    <col id="border_colgroup" />
                    <col id="border_colgroup" />
                    <col id="border_colgroup" />
                </colgroup>
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
                        <td style={{ fontWeight: "bold" }}>Rrs 5 ins</td>
                        <td>{patient?.OscillometryData?.LLN}</td>
                        <td>{patient?.OscillometryData?.Pred}</td>
                        <td>{patient?.OscillometryData?.ULN}</td>
                        <td style={{ backgroundColor: getAnomalyStatusColor(patient?.OscillometryData?.ins['Z-score'] ?? 0) }}>{patient?.OscillometryData?.ins.Baseline}</td>
                        <td style={{ backgroundColor: getAnomalyStatusColor(patient?.OscillometryData?.ins['Z-score'] ?? 0) }}>{patient?.OscillometryData?.ins['%Pred']}%</td>
                        <td style={{ backgroundColor: getAnomalyStatusColor(patient?.OscillometryData?.ins['Z-score'] ?? 0) }}>{patient?.OscillometryData?.ins['Z-score']}</td>
                    </tr>
                    <tr>
                        <td style={{ fontWeight: "bold" }}>Rrs 5 exp</td>
                        <td>{patient?.OscillometryData?.LLN}</td>
                        <td>{patient?.OscillometryData?.Pred}</td>
                        <td>{patient?.OscillometryData?.ULN}</td>
                        <td style={{ backgroundColor: getAnomalyStatusColor(patient?.OscillometryData?.exp['Z-score'] ?? 0) }}>{patient?.OscillometryData?.exp.Baseline}</td>
                        <td style={{ backgroundColor: getAnomalyStatusColor(patient?.OscillometryData?.exp['Z-score'] ?? 0) }}>{patient?.OscillometryData?.exp['%Pred']}%</td>
                        <td style={{ backgroundColor: getAnomalyStatusColor(patient?.OscillometryData?.exp['Z-score'] ?? 0) }}>{patient?.OscillometryData?.exp['Z-score']}</td>
                    </tr>
                    <tr>
                        <td style={{ fontWeight: "bold" }}>Rrs 5 tot</td>
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
