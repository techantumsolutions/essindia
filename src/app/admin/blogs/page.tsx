'use client';

import React from 'react';
import { BlogManager } from '../pages/_managers';

export default function AdminBlogsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      <BlogManager />
    </div>
  );
}
