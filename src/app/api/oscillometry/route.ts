import { loadDB } from "@/functions";
import { NextRequest, NextResponse } from "next/server";
import { Patient } from "@/models/patient";

export async function GET(request: NextRequest) {

  if (!request.nextUrl.searchParams.has("Id"))
    return NextResponse.json({
      error: "params Id is required",
    });

  try {
    //Estraiamo il parametro id
    const id = parseInt(request.nextUrl.searchParams.get("Id")!);
    //Leggiamo il file csv
    const patients: Patient[] = await loadDB();
    //Cerchiamo fra i dati estratti il paziente con id corrispondente
    const patient = patients.find((patient) => patient.Id === id);
    if (!patient)
      return NextResponse.json({
        error: "Paziente non trovato",
      });

    //Restituiamo il paziente
    return NextResponse.json(patient);

  } catch (error) {
    console.error("Error processing oscillometry data:", error);
    return NextResponse.json({
      error: error,
    });
  }
}
