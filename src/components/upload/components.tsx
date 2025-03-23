"use client"

import React, { useState } from 'react';

interface Link {
  id: string;
  title: string;
  url: string;
}

interface Folder {
  id: string;
  title: string;
  children: Array<Link | Folder>;
}

const NestedLinksComponent = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [newLinkData, setNewLinkData] = useState<{ title: string; url: string }>({
    title: '',
    url: '',
  });
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [parentIdForLink, setParentIdForLink] = useState<string | undefined>(undefined);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [newFolderTitle, setNewFolderTitle] = useState<string>('');

  // Add a new folder
  const addFolder = (parentId?: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      title: 'New Folder',
      children: [],
    };

    if (parentId) {
      setFolders(prevFolders =>
        prevFolders.map(folder =>
          folder.id === parentId
            ? { ...folder, children: [...folder.children, newFolder] }
            : folder
        )
      );
    } else {
      setFolders(prevFolders => [...prevFolders, newFolder]);
    }
  };

  // Add a new link
  const addLink = (parentId?: string) => {
    if (!newLinkData.title || !newLinkData.url) {
      alert('Please fill in both the title and the URL.');
      return;
    }

    const newLink: Link = {
      id: Date.now().toString(),
      title: newLinkData.title,
      url: newLinkData.url,
    };

    if (parentId) {
      setFolders(prevFolders =>
        prevFolders.map(folder =>
          folder.id === parentId
            ? { ...folder, children: [...folder.children, newLink] }
            : folder
        )
      );
    } else {
      setFolders(prevFolders => [...prevFolders, { id: Date.now().toString(), title: 'Root', children: [newLink] }]);
    }

    // Reset the link input fields
    setNewLinkData({ title: '', url: '' });
    setShowLinkInput(false);
  };

  // Handle folder title editing
  const handleFolderTitleChange = (e: React.ChangeEvent<HTMLInputElement>, folderId: string) => {
    setNewFolderTitle(e.target.value);
  };

  const handleFolderTitleBlur = (folderId: string) => {
    setFolders(prevFolders =>
      prevFolders.map(folder =>
        folder.id === folderId ? { ...folder, title: newFolderTitle } : folder
      )
    );
    setEditingFolderId(null);
  };

  const handleFolderTitleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    folderId: string
  ) => {
    if (e.key === 'Enter') {
      setFolders(prevFolders =>
        prevFolders.map(folder =>
          folder.id === folderId ? { ...folder, title: newFolderTitle } : folder
        )
      );
      setEditingFolderId(null);
    }
  };

  // Render folder or link recursively
  const renderFolderOrLink = (item: Link | Folder, parentId?: string) => {
    if ('children' in item) {
      return (
        <div key={item.id} className="ml-4 mt-2">
          <div className="flex items-center space-x-2">
            {editingFolderId === item.id ? (
              <input
                type="text"
                value={newFolderTitle}
                onChange={(e) => handleFolderTitleChange(e, item.id)}
                onBlur={() => handleFolderTitleBlur(item.id)}
                onKeyPress={(e) => handleFolderTitleKeyPress(e, item.id)}
                className="font-semibold text-lg border-b-2 border-gray-400 rounded-sm"
                autoFocus
              />
            ) : (
              <span
                className="font-semibold text-lg cursor-pointer"
                onClick={() => {
                  setEditingFolderId(item.id);
                  setNewFolderTitle(item.title);
                }}
              >
                {item.title}
              </span>
            )}
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              onClick={() => addFolder(item.id)}
            >
              Add Folder
            </button>
            <button
              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              onClick={() => {
                setParentIdForLink(item.id);
                setShowLinkInput(true);
              }}
            >
              Add Link
            </button>
          </div>
          <div className="ml-6">
            {item.children.map(child => renderFolderOrLink(child, item.id))}
          </div>
        </div>
      );
    } else {
      return (
        <div key={item.id} className="mt-2 ml-6">
          <span className="font-medium">{item.title}</span> -{' '}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {item.url}
          </a>
        </div>
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex space-x-4 mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => addFolder()}
        >
          Add Folder
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          onClick={() => setShowLinkInput(true)}
        >
          Add Link
        </button>
      </div>

      {/* Link Input Form */}
      {showLinkInput && (
        <div className="mb-4 p-4 border border-gray-300 rounded">
          <div className="mb-2">
            <label className="block font-medium">Title:</label>
            <input
              type="text"
              value={newLinkData.title}
              onChange={(e) => setNewLinkData({ ...newLinkData, title: e.target.value })}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              placeholder="Enter link title"
            />
          </div>
          <div className="mb-2">
            <label className="block font-medium">URL:</label>
            <input
              type="url"
              value={newLinkData.url}
              onChange={(e) => setNewLinkData({ ...newLinkData, url: e.target.value })}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              placeholder="Enter link URL"
            />
          </div>
          <div className="flex space-x-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={() => addLink(parentIdForLink)}
            >
              Add Link
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              onClick={() => setShowLinkInput(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div>
        {folders.map(folder => renderFolderOrLink(folder))}
      </div>
    </div>
  );
};

export default NestedLinksComponent;

