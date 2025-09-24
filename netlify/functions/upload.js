import fetch from "node-fetch";

export async function handler(event) {
  try {
    const { filename, base64image } = JSON.parse(event.body);

    const repoUser = "kalaiselvan0962"; // GitHub username
    const repoName = "my-images";       // repository name
    const branch = "main";              // branch to commit
    const folder = "uploads";           // folder in repo

    const url = `https://api.github.com/repos/${repoUser}/${repoName}/contents/${folder}/${filename}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `token ${process.env.GITHUB_PAT}`, // token stored as environment variable
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Upload ${filename}`,
        content: base64image,
        branch: branch
      })
    });

    const data = await res.json();

    if (!res.ok) return { statusCode: res.status, body: JSON.stringify(data) };

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Upload successful",
        link: `https://${repoUser}.github.io/${repoName}/${folder}/${filename}`
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
