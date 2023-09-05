export default function download(
  content: Uint8Array,
  filename: string,
  contentType = 'application/octet-stream'
) {
  const a = document.createElement('a');
  const blob = new Blob([content], { type: contentType });
  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}
