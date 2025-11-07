export function renderMapPage(embedUrl: string) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Map</title>
<style>
  html,body{height:100%;margin:0}
  iframe{border:0;width:100%;height:100%}
</style>
</head>
<body>
<iframe src="${embedUrl}" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>
</body>
</html>`;
}
