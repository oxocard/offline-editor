export type SpiffsFile = {
  path: string;
  name: string;
};

export type SpiffsFolder = {
  path: string;
  name: string;
  files: SpiffsFile[];
  folders: SpiffsFolder[];
};

export type SpiffsStructure = {
  path: string;
  files: SpiffsFile[];
  folders: SpiffsFolder[];
};

export type SpiffsState = {
  fileStructure: SpiffsStructure;
  totalSpace: number;
  usedSpace: number;
};
