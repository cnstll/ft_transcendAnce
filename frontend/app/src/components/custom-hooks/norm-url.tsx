function NormUrl(prefixUrl: string, oldUrl: string): string {
  const url = prefixUrl + oldUrl.replace(/\s+/g, '-');
  return url;
}

export default NormUrl;
