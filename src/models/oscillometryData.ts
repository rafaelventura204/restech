export interface OscillometryData {
    //attributi generali dell'oscillometria
    Pred: number;
    LLN: number;
    ULN: number;
    BMI: number; //TODO: controllare questa forzatura

    //attributi specifici di ogni caso
    ins: OscillometryCaseData; //inspirazione
    exp: OscillometryCaseData; //espirazione
    tot: OscillometryCaseData; //totale
}

//Contiene tutti i dati relativi ad un caso
export interface OscillometryCaseData {
    Baseline: string; //è il valore di Rrs_ins, Rrs_exp o Rrs_tot
    "Z-score": number;
    "%Pred": number | null; //TODO: controllare questa forzatura, cioè di far accettare number oppure null, è giusto?
}
