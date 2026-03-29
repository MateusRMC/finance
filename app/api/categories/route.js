import { supabase } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase
    .schema("finance")
    .from("categories")
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message });
  }

  return NextResponse.json(data);
}
