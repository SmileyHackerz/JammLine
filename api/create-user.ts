// apps/web/api/create-user.ts
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: any, res: any) {
  // 1. On initialise Supabase avec la clé SERVICE ROLE (Super Pouvoir)
  const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  );

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { email, password, nom, role, service, telephone } = req.body;

  try {
    // 2. Création de l'utilisateur dans l'AUTH (sans déconnecter l'admin)
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // On valide l'email automatiquement
      });

    if (authError) throw authError;

    // 3. Création du profil associé dans la table "profiles"
    if (authData.user) {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .insert([
          {
            id: authData.user.id,
            nom,
            email,
            role,
            service,
            telephone,
            settings: { notifications: true, darkMode: false },
          },
        ]);

      if (profileError) throw profileError;
    }

    return res.status(200).json({ success: true, user: authData.user });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
