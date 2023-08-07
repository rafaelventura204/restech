import { OscillometryData } from "./oscillometryData";

export interface Patient {
  Id: number;
  Name: string;
  Surname: string;
  Height: number;
  Weight: number;
  Sex: string;
  Age: number;
  OscillometryData: OscillometryData; //ogni paziente ha i suoi dati dell'oscillometro
}
