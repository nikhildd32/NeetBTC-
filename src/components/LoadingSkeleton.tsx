import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const Skeleton = ({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  lines = 1
}: SkeletonProps) => {
  const baseClasses = "bg-gradient-to-r from-purple-900/30 via-purple-800/50 to-purple-900/30 animate-pulse";
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
    rounded: 'rounded-lg'
  };

  const style = {
    width: width || (variant === 'circular' ? height : '100%'),
    height: height || (variant === 'text' ? '1rem' : '2rem')
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]}`}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : '100%'
            }}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.1
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      initial={{ opacity: 0.3 }}
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{
        duration: 1.5,
        repeat: Infinity
      }}
    />
  );
};

// Specific skeleton components for different sections
export const StatCardSkeleton = () => (
  <div className="p-6 rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-900/30 to-purple-800/10">
    <div className="flex justify-between items-start mb-4">
      <Skeleton variant="circular" width={48} height={48} />
      <Skeleton width={60} height={24} variant="rounded" />
    </div>
    <Skeleton variant="text" className="mb-2" />
    <Skeleton width={120} height={32} className="mb-2" />
    <Skeleton variant="text" width="60%" />
  </div>
);

export const BlockCardSkeleton = () => (
  <div className="rounded-xl p-4 border border-gray-600/30 bg-gradient-to-br from-gray-900/40 to-gray-800/20 min-w-[180px] flex-shrink-0">
    <div className="text-center">
      <div className="rounded-lg p-2 mb-3 bg-gray-600/20">
        <Skeleton variant="circular" width={20} height={20} className="mx-auto" />
      </div>
      <Skeleton width={80} height={24} className="mb-1 mx-auto" />
      <Skeleton width={100} height={16} className="mb-3 mx-auto" />
      <div className="space-y-1">
        <div className="flex justify-between">
          <Skeleton width={30} height={12} />
          <Skeleton width={40} height={12} />
        </div>
        <div className="flex justify-between">
          <Skeleton width={35} height={12} />
          <Skeleton width={50} height={12} />
        </div>
        <div className="flex justify-between">
          <Skeleton width={40} height={12} />
          <Skeleton width={45} height={12} />
        </div>
      </div>
    </div>
  </div>
);

export const NewsCardSkeleton = () => (
  <div className="block bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/30 rounded-xl overflow-hidden backdrop-blur-sm">
    <div className="p-6 flex gap-6">
      <Skeleton width={192} height={128} variant="rounded" className="flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <Skeleton variant="text" lines={2} className="mb-3" />
        <Skeleton variant="text" lines={3} className="mb-4" />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Skeleton width={80} height={24} variant="rounded" />
            <Skeleton width={60} height={16} />
          </div>
          <Skeleton width={70} height={16} />
        </div>
      </div>
    </div>
  </div>
);

export const FeeCardSkeleton = () => (
  <div className="p-6 rounded-xl border border-purple-500/30 backdrop-blur-sm bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-purple-900/30">
    <div className="flex justify-between items-start mb-4">
      <div>
        <Skeleton width={100} height={24} className="mb-1" />
        <Skeleton width={120} height={16} />
      </div>
      <Skeleton variant="circular" width={40} height={40} />
    </div>
    
    <div className="space-y-3">
      <div>
        <Skeleton width={150} height={36} className="mb-1" />
        <Skeleton width={80} height={16} />
      </div>
      
      <div className="pt-3 border-t border-gray-600/30">
        <div className="space-y-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton width={60} height={14} />
              <Skeleton width={80} height={14} />
            </div>
          ))}
        </div>
      </div>
      
      <Skeleton variant="text" lines={2} />
    </div>
  </div>
);