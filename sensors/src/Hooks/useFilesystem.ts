import { useState } from "react";
import {
  Filesystem,
  Directory,
  Encoding,
} from "@capacitor/filesystem";

type WriteFileParams = {
  path: string;
  data: unknown;
  directory?: Directory;
  isJson?: boolean;
};

type ReadFileParams = {
  path: string;
  directory?: Directory;
  isJson?: boolean;
};

type DeleteFileParams = {
  path: string;
  directory?: Directory;
};

type ListFilesParams = {
  path?: string;
  directory?: Directory;
};

type CreateDirParams = {
  path: string;
  directory?: Directory;
};

type DeleteDirParams = {
  path: string;
  directory?: Directory;
  recursive?: boolean;
};

type FilesystemListItem = Awaited<ReturnType<typeof Filesystem.readdir>>["files"][number];

export const useFilesystem = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const writeFile = async ({
    path,
    data,
    directory = Directory.Documents,
    isJson = true,
  }: WriteFileParams): Promise<boolean> => {
    try {
      setLoading(true);

      const content = isJson ? JSON.stringify(data) : String(data);

      await Filesystem.writeFile({
        path,
        data: content,
        directory,
        encoding: Encoding.UTF8,
      });

      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const readFile = async ({
    path,
    directory = Directory.Documents,
    isJson = true,
  }: ReadFileParams): Promise<unknown | null> => {
    try {
      setLoading(true);

      const result = await Filesystem.readFile({
        path,
        directory,
        encoding: Encoding.UTF8,
      });

      return isJson ? JSON.parse(result.data as string) : result.data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async ({
    path,
    directory = Directory.Documents,
  }: DeleteFileParams): Promise<boolean> => {
    try {
      setLoading(true);

      await Filesystem.deleteFile({
        path,
        directory,
      });

      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const listFiles = async ({
    path = "",
    directory = Directory.Documents,
  }: ListFilesParams): Promise<FilesystemListItem[]> => {
    try {
      setLoading(true);

      const result = await Filesystem.readdir({
        path,
        directory,
      });

      return result.files;
    } catch (err) {
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createDir = async ({
    path,
    directory = Directory.Documents,
  }: CreateDirParams): Promise<boolean> => {
    try {
      setLoading(true);

      await Filesystem.mkdir({
        path,
        directory,
        recursive: true,
      });

      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteDir = async ({
    path,
    directory = Directory.Documents,
    recursive = true,
  }: DeleteDirParams): Promise<boolean> => {
    try {
      setLoading(true);

      await Filesystem.rmdir({
        path,
        directory,
        recursive,
      });

      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    writeFile,
    readFile,
    deleteFile,
    listFiles,
    createDir,
    deleteDir,
  };
};