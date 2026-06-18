import React, { useEffect, useState } from 'react';
import styles from './PipelineView.module.css';

interface PipelineNode {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'done' | 'error';
  progress: number;
}

export function PipelineView() {
  const [nodes, setNodes] = useState<PipelineNode[]>([
    { id: 'input', name: 'Input', status: 'done', progress: 100 },
    { id: 'analysis', name: 'Analysis', status: 'pending', progress: 0 },
    { id: 'routing', name: 'Routing', status: 'pending', progress: 0 },
    { id: 'execution', name: 'Execution', status: 'pending', progress: 0 },
    { id: 'output', name: 'Output', status: 'pending', progress: 0 },
  ]);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Processing Pipeline</h3>
      <div className={styles.pipeline}>
        {nodes.map((node, idx) => (
          <React.Fragment key={node.id}>
            <div className={`${styles.node} ${styles[node.status]}`}>
              <div className={styles.nodeName}>{node.name}</div>
              <div className={styles.progress}>
                <div 
                  className={styles.progressBar} 
                  style={{ width: `${node.progress}%` }}
                />
              </div>
            </div>
            {idx < nodes.length - 1 && <div className={styles.arrow}>→</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
