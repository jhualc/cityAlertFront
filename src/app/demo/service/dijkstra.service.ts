import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DijkstraService {
  dijkstra(graph: Record<string, Record<string, number>>, start: string): Record<string, number> {
    const distances: Record<string, number> = {};
    const visited = new Set<string>();
    const pq = new Map<string, number>();

    for (const node in graph) {
      distances[node] = Infinity;
    }
    distances[start] = 0;
    pq.set(start, 0);

    while (pq.size > 0) {
      const current = [...pq.entries()].reduce((a, b) => (a[1] < b[1] ? a : b))[0];
      pq.delete(current);
      visited.add(current);

      for (const neighbor in graph[current]) {
        if (visited.has(neighbor)) continue;

        const newDist = distances[current] + graph[current][neighbor];
        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          pq.set(neighbor, newDist);
        }
      }
    }

    return distances;
  }
}