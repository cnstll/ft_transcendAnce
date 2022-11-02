declare module '*.jpg';
declare module '*.png' {
  const value: string;
  export = value;
}
declare module '*.jpeg';
declare module '*.gif';
declare module 'qrcode';
