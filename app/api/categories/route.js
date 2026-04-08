import { supabase } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase.schema("finance").from("categories").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(req) {
  try {
    const body = await req.json();

    const results = await Promise.all(
      body.map(({ id, title, budget }) =>
        supabase
          .schema("finance")
          .from("categories")
          .update({
            title,
            budget,
          })
          .eq("id", id),
      ),
    );

    const failedUpdate = results.find((result) => result.error);

    if (failedUpdate) {
      return NextResponse.json({ error: failedUpdate.error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Categorias atualizadas com sucesso",
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar categorias" }, { status: 500 });
  }
}
