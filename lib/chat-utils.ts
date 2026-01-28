// Format relative time (e.g., "5 menit lalu", "Kemarin", etc)
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'Baru saja';
  }
  
  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} menit lalu`;
  }
  
  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} jam lalu`;
  }
  
  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return `Kemarin ${messageDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} hari lalu`;
  }
  
  // Default: show full date
  return messageDate.toLocaleDateString('id-ID', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format date for message groups (e.g., "Hari ini", "Kemarin", "12 Jan 2026")
export function formatMessageDate(date: string | Date): string {
  const now = new Date();
  const messageDate = new Date(date);
  
  // Today
  if (messageDate.toDateString() === now.toDateString()) {
    return 'Hari ini';
  }
  
  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Kemarin';
  }
  
  // This year
  if (messageDate.getFullYear() === now.getFullYear()) {
    return messageDate.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short' 
    });
  }
  
  // Other years
  return messageDate.toLocaleDateString('id-ID', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
}

// Format time only (e.g., "14:30")
export function formatTimeOnly(date: string | Date): string {
  return new Date(date).toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

// Check if message can be edited/deleted (within 5 minutes)
export function canEditOrDelete(messageDate: string | Date): boolean {
  const now = new Date();
  const msgDate = new Date(messageDate);
  const diffInMs = now.getTime() - msgDate.getTime();
  const fiveMinutes = 5 * 60 * 1000;
  
  return diffInMs < fiveMinutes;
}

// Get time remaining for edit/delete
export function getEditTimeRemaining(messageDate: string | Date): string {
  const now = new Date();
  const msgDate = new Date(messageDate);
  const diffInMs = now.getTime() - msgDate.getTime();
  const fiveMinutes = 5 * 60 * 1000;
  const remainingMs = fiveMinutes - diffInMs;
  
  if (remainingMs <= 0) return '';
  
  const remainingSeconds = Math.floor(remainingMs / 1000);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

// Play notification sound
export function playNotificationSound() {
  try {
    const audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => {
      console.log('Could not play notification sound:', err);
    });
  } catch (error) {
    console.log('Notification sound not available');
  }
}

// Get file extension from filename
export function getFileExtension(filename: string): string {
  return filename.slice(filename.lastIndexOf('.') + 1).toLowerCase();
}

// Check if file is an image
export function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  return imageExtensions.includes(getFileExtension(filename));
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
