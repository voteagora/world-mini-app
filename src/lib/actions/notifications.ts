"use server";

export async function setNotificationPreferences(
  address: `0x${string}`,
  notificationPreferences: boolean
) {
  try {
    const apiKey = process.env.AGORA_API_KEY;
    const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    if (!apiKey || !address || !bypass) {
      throw new Error("AGORA_API_KEY not configured");
    }

    const response = await fetch(
      "https://agora-next-world.vercel.app/api/common/notifications/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "x-vercel-protection-bypass": bypass,
        },
        body: JSON.stringify({
          address,
          notificationPreferences,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`External API error: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error setting notification preferences:", error);
    throw error;
  }
}
