import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .schema("finance")
    .from("expenses")
    .select("*, category_features: category_id (title, category_color)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req) {
  const body = await req.json();

  const { data, error } = await supabase
    .schema("finance")
    .from("expenses")
    .insert({
      category_id: body.category_id,
      amount: Number(body.amount),
    })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(req) {
  const body = await req.json();

  const { data, error } = await supabase
    .schema("finance")
    .from("expenses")
    .update({
      amount: Number(body.amount),
      category_id: Number(body.category_id),
    })
    .eq("id", body.id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(req) {
  const body = await req.json();

  const { data, error } = await supabase
    .schema("finance")
    .from("expenses")
    .delete()
    .eq("id", body.id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
