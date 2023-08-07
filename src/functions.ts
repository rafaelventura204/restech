/**
 * This page's useful to contain the functions
 *
 */

import { Patient } from "./models/patient";
import fs from "fs";
import csvParser from "csv-parser";

//questa interfaccia rappresenta i dati come sono presenti nel file model.csv
interface CsvRowFormat {
    Id: string;
    Age: string;
    Sex: string;
    Height: string;
    Weight: string;
    Freq: string;
    Rrs_ins: string;
    Rrs_exp: string;
    Rrs_tot: string;
}

async function loadDB(): Promise<Patient[]> {
    const db = await readCSV();

    return db.map(parsePatient)
}

//questa funzione legge i dati dal file model.csv, e li restituisce trasformati in pazienti
async function readCSV(): Promise<CsvRowFormat[]> {
    const filePath = "src/database/model.csv";
    const data: CsvRowFormat[] = [];

    return new Promise<CsvRowFormat[]>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on("data", (row: CsvRowFormat) => data.push(row))
            .on("end", () => resolve(data))
            .on("error", (err) => reject(err));
    });
}

//Trasforma un record del file .csv in un paziente, calcolando i parametri necessari
function parsePatient(row: CsvRowFormat): Patient {
    const pred = calculatePred(
        parseFloat(row.Height),
        parseFloat(row.Weight),
        parseInt(row.Age)
    );
    const LLN = calculateLLN(
        parseFloat(row.Height),
        parseFloat(row.Weight),
        parseInt(row.Age)
    );
    const ULN = calculateULN(
        parseFloat(row.Height),
        parseFloat(row.Weight),
        parseInt(row.Age)
    );

    const BMI = calculateBMI(
        parseFloat(row.Weight),
        parseFloat(row.Height)
    );
    const patient: Patient = {
        Id: parseInt(row.Id),
        Name: "Rosanna", // TODO: visualizzare il colore in blu
        Surname: "Wallace", //NOTE: i nomi non sono presenti nel DB quindi è stato aggiunto in maniera statica
        Height: calculateHeight(parseFloat(row.Height)),
        Weight: parseFloat(row.Weight),
        Sex: row.Sex,
        Age: parseInt(row.Age),
        OscillometryData: {
            LLN: LLN,
            ULN: ULN,
            Pred: pred,
            BMI: BMI,
            ins: {
                Baseline: parseFloat(row.Rrs_ins).toFixed(2), //TODO: sarebbe utile fare una formattazione unica per ogni valore, così è molto limitato
                "Z-score": calculateZScore(parseFloat(row.Rrs_ins), pred),
                "%Pred": parseInt(
                    Math.ceil((parseFloat(row.Rrs_ins) * 100) / pred).toString()
                ),
            },
            exp: {
                Baseline: parseFloat(row.Rrs_exp).toFixed(2),
                "Z-score": calculateZScore(parseFloat(row.Rrs_exp), pred),
                "%Pred": parseInt(
                    Math.ceil((parseFloat(row.Rrs_exp) * 100) / pred).toString()
                ),
            },
            tot: {
                Baseline: parseFloat(row.Rrs_tot).toFixed(2),
                "Z-score": calculateZScore(parseFloat(row.Rrs_tot), pred),
                "%Pred": parseInt(
                    Math.ceil((parseFloat(row.Rrs_tot) * 100) / pred).toString()
                ),
            },
        },
    };
    return patient;
}

//sapere il numero di numeri dopo la virgola
function countDecimalDigits(value: string): number {
    const decimalIndex = value.indexOf(".");
    if (decimalIndex !== -1) {
        return value.length - decimalIndex - 1;
    } else {
        return 0;
    }
}

function calculateZScore(baseline: number, pred: number): number {//TODO: vedere arrontondamento
    const zScore = Math.abs(Math.log(baseline / 1.0197) - Math.log(pred / 1.0197)) / 0.2803;
    const roundedZScore = Math.ceil(zScore * 100) / 100; // Arrotondamento per eccesso a due decimali
    return roundedZScore//+roundedZScore.toFixed(2);

    // return (
    //     Math.abs(Math.log(baseline / 1.0197) - Math.log(pred / 1.0197)) / 0.2803
    // );
}

function calculateLLN(height: number, weight: number, age: number): number {
    return parseFloat(
        (
            1.0197 *
            Math.exp(5.327 - 3.032 * height + 0.0139 * weight - 0.0038 * age - 0.459)
        ).toFixed(2)
    );
}

function calculatePred(height: number, weight: number, age: number): number {
    return parseFloat(
        (
            1.0197 * Math.exp(5.327 - 3.032 * height + 0.0139 * weight - 0.0038 * age)
        ).toFixed(2)
    );
}

function calculateULN(height: number, weight: number, age: number): number {
    return parseFloat(
        (
            1.0197 *
            Math.exp(5.327 - 3.032 * height + 0.0139 * weight - 0.0038 * age + 0.459)
        ).toFixed(2)
    );
}

function calculateHeight(height: number): number {
    const intValue = Math.floor(height); // Get the integer part
    const decimalValue = height - intValue; // Get the decimal part

    const centimeters = intValue * 100 + Math.round(decimalValue * 100);

    return centimeters;
}

function calculateBMI(weightKg: number, heightCm: number): number {

    if (heightCm <= 0)
        throw new Error('heightCm must be greater than 0')


    // Convert height from centimeters to meters
    const heightMeters = calculateHeight(heightCm) / 100;

    // Calculate BMI
    const bmi = weightKg / (heightMeters * heightMeters);

    return Number(bmi.toFixed(1));
}


export { loadDB, calculateHeight, calculateBMI };
