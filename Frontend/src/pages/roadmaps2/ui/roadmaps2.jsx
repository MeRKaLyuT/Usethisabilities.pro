import React from 'react';
import * as styles from './roadmaps2.module.css';
import { Card, CardContent, Typography, Chip } from '@mui/material';

const roadmapsData = [
    {
        id: 'backend',
        title: 'Backend Разработчик',
        subtitle: 'API, data, и основы серверной надежности.',
        difficulty: 'Средний',
        nodes: [
            { id: 'http', title: 'HTTP', tagSlug: 'http', x: 10, y: 20, group: 'core' },
            { id: 'rest', title: 'REST', tagSlug: 'rest', x: 22, y: 30, group: 'core' },
            { id: 'django', title: 'Django / DRF', tagSlug: 'django-drf', x: 34, y: 22, group: 'framework' },
            { id: 'auth', title: 'Auth (JWT + Cookies)', tagSlug: 'auth-jwt-cookies', x: 48, y: 30, group: 'security' },
            { id: 'postgres', title: 'PostgreSQL', tagSlug: 'postgresql', x: 60, y: 24, group: 'data' },
            { id: 'cache', title: 'Caching', tagSlug: 'caching', x: 72, y: 34, group: 'data' },
            { id: 'docker', title: 'Docker', tagSlug: 'docker', x: 84, y: 26, group: 'infra' },
            { id: 'testing', title: 'Testing', tagSlug: 'backend-testing', x: 28, y: 46, group: 'quality' },
            { id: 'async', title: 'Async Tasks', tagSlug: 'async-tasks', x: 42, y: 50, group: 'ops' },
            { id: 'nginx', title: 'Nginx', tagSlug: 'nginx', x: 60, y: 52, group: 'infra' },
            { id: 'cicd', title: 'CI/CD', tagSlug: 'ci-cd', x: 76, y: 58, group: 'ops' },
            { id: 'observability', title: 'Observability', tagSlug: 'observability', x: 90, y: 72, group: 'ops' },
        ],
        links: [
            { from: 'http', to: 'rest' },
            { from: 'rest', to: 'django' },
            { from: 'django', to: 'auth' },
            { from: 'auth', to: 'postgres' },
            { from: 'postgres', to: 'cache' },
            { from: 'cache', to: 'docker' },
            { from: 'docker', to: 'cicd' },
            { from: 'cicd', to: 'observability' },
            { from: 'django', to: 'testing' },
            { from: 'testing', to: 'async' },
            { from: 'async', to: 'nginx' },
            { from: 'nginx', to: 'cicd' },
        ],
    },
    {
        id: 'frontend',
        title: 'Frontend Разработчик',
        subtitle: 'Основы UI с использованием современных инструментов для приложений.',
        difficulty: 'Начинающий',
        nodes: [
            { id: 'htmlcss', title: 'HTML / CSS', tagSlug: 'html-css', x: 10, y: 25, group: 'core' },
            { id: 'js', title: 'JavaScript', tagSlug: 'javascript', x: 22, y: 36, group: 'core' },
            { id: 'ts', title: 'TypeScript', tagSlug: 'typescript', x: 28, y: 18, group: 'tools' },
            { id: 'react', title: 'React', tagSlug: 'react', x: 40, y: 30, group: 'framework' },
            { id: 'state', title: 'State', tagSlug: 'state-management', x: 52, y: 22, group: 'framework' },
            { id: 'rq', title: 'React Query', tagSlug: 'react-query', x: 62, y: 20, group: 'tools' },
            { id: 'mui', title: 'MUI', tagSlug: 'mui', x: 70, y: 32, group: 'ui' },
            { id: 'routing', title: 'Routing', tagSlug: 'routing', x: 58, y: 42, group: 'framework' },
            { id: 'testing', title: 'Testing', tagSlug: 'frontend-testing', x: 74, y: 52, group: 'quality' },
            { id: 'build', title: 'Build', tagSlug: 'build-tools', x: 86, y: 34, group: 'tools' },
            { id: 'perf', title: 'Performance', tagSlug: 'frontend-performance', x: 90, y: 70, group: 'quality' },
        ],
        links: [
            { from: 'htmlcss', to: 'js' },
            { from: 'js', to: 'react' },
            { from: 'js', to: 'ts' },
            { from: 'ts', to: 'react' },
            { from: 'react', to: 'state' },
            { from: 'state', to: 'rq' },
            { from: 'rq', to: 'mui' },
            { from: 'mui', to: 'build' },
            { from: 'react', to: 'routing' },
            { from: 'routing', to: 'testing' },
            { from: 'testing', to: 'perf' },
            { from: 'build', to: 'perf' },
        ],
    },
    {
        id: 'devops',
        title: 'DevOps Основы',
        subtitle: 'Автоматизация, инфраструктура и процесс доставки информации.',
        difficulty: 'Средний',
        nodes: [
            { id: 'linux', title: 'Linux Basics', tagSlug: 'linux', x: 10, y: 22, group: 'core' },
            { id: 'network', title: 'Networking', tagSlug: 'networking', x: 24, y: 32, group: 'core' },
            { id: 'git', title: 'Git', tagSlug: 'git', x: 18, y: 52, group: 'tools' },
            { id: 'script', title: 'Scripting', tagSlug: 'scripting', x: 34, y: 20, group: 'tools' },
            { id: 'docker', title: 'Docker', tagSlug: 'docker', x: 42, y: 32, group: 'infra' },
            { id: 'k8s', title: 'Kubernetes', tagSlug: 'kubernetes', x: 56, y: 26, group: 'infra' },
            { id: 'cloud', title: 'Cloud', tagSlug: 'cloud', x: 72, y: 20, group: 'cloud' },
            { id: 'cicd', title: 'CI/CD', tagSlug: 'ci-cd', x: 60, y: 46, group: 'ops' },
            { id: 'monitor', title: 'Monitoring', tagSlug: 'monitoring', x: 74, y: 38, group: 'ops' },
            { id: 'iac', title: 'IaC', tagSlug: 'infrastructure-as-code', x: 82, y: 50, group: 'infra' },
            { id: 'security', title: 'Security', tagSlug: 'security', x: 92, y: 70, group: 'ops' },
        ],
        links: [
            { from: 'linux', to: 'network' },
            { from: 'network', to: 'docker' },
            { from: 'docker', to: 'k8s' },
            { from: 'k8s', to: 'cloud' },
            { from: 'cloud', to: 'iac' },
            { from: 'iac', to: 'security' },
            { from: 'linux', to: 'git' },
            { from: 'git', to: 'cicd' },
            { from: 'cicd', to: 'monitor' },
            { from: 'monitor', to: 'iac' },
            { from: 'network', to: 'script' },
            { from: 'script', to: 'docker' },
        ],
    },
];

const Roadmaps2 = () => {
    const [selectedRoadmapId, setSelectedRoadmapId] = React.useState(roadmapsData[0].id);
    const selectedRoadmap = roadmapsData.find((item) => item.id === selectedRoadmapId) || roadmapsData[0];
    const mapRef = React.useRef(null);

    const nodeMap = React.useMemo(() => {
        const map = new Map();
        selectedRoadmap.nodes.forEach((node) => map.set(node.id, node));
        return map;
    }, [selectedRoadmap]);

    const clearActiveLinks = React.useCallback(() => {
        const map = mapRef.current;
        if (!map) return;
        map.querySelectorAll(`.${styles.linkActive}`).forEach((line) => {
            line.classList.remove(styles.linkActive);
        });
    }, []);

    const highlightLinks = React.useCallback((nodeId) => {
        const map = mapRef.current;
        if (!map) return;
        clearActiveLinks();
        map.querySelectorAll(`[data-link-from="${nodeId}"], [data-link-to="${nodeId}"]`).forEach((line) => {
            line.classList.add(styles.linkActive);
        });
    }, [clearActiveLinks]);

    const handleNodeClick = React.useCallback((tagSlug) => {
        window.location.href = `/courses?tag=${encodeURIComponent(tagSlug)}`;
    }, []);

    const handleCardKeyDown = (event, roadmapId) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setSelectedRoadmapId(roadmapId);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Роадмапы</h1>
                        <p className={styles.lead}>
                            Исследуйте созвездия навыков и выберите маршрут, соответствующий вашей миссии.
                        </p>
                    </div>
                    <div className={styles.headerHint}>
                        <span className={styles.headerDot} aria-hidden="true" />
                        Кликните на точку-звезду, чтобы найти курс в каталоге
                    </div>
                </header>

                <div className={styles.layout}>
                    <section className={styles.roadmapsList}>
                        {roadmapsData.map((roadmap) => (
                            <Card
                                key={roadmap.id}
                                className={`${styles.roadmapCard} ${roadmap.id === selectedRoadmapId ? styles.roadmapCardActive : ''}`}
                                elevation={0}
                                role="button"
                                tabIndex={0}
                                onClick={() => setSelectedRoadmapId(roadmap.id)}
                                onKeyDown={(event) => handleCardKeyDown(event, roadmap.id)}
                            >
                                <CardContent className={styles.roadmapCardContent}>
                                    <Typography variant="h6" component="h3" className={styles.roadmapTitle}>
                                        {roadmap.title}
                                    </Typography>
                                    <Typography variant="body2" className={styles.roadmapSubtitle}>
                                        {roadmap.subtitle}
                                    </Typography>
                                    <div className={styles.roadmapMeta}>
                                        <Chip
                                            label={roadmap.difficulty}
                                            variant="outlined"
                                            size="small"
                                            className={styles.roadmapChip}
                                        />
                                        <span className={styles.roadmapCount}>{roadmap.nodes.length} пунктов</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </section>

                    <section className={styles.mapSection}>
                        <div className={styles.mapHeader}>
                            <div>
                                <h2 className={styles.mapTitle}>{selectedRoadmap.title}</h2>
                                <p className={styles.mapSubtitle}>{selectedRoadmap.subtitle}</p>
                            </div>
                            <div className={styles.mapBadge}>{selectedRoadmap.difficulty}</div>
                        </div>

                        <div className={styles.mapCanvas} ref={mapRef} onMouseLeave={clearActiveLinks}>
                            <svg className={styles.mapLines} viewBox="0 0 100 100" preserveAspectRatio="none">
                                {selectedRoadmap.links.map((link, index) => {
                                    const fromNode = nodeMap.get(link.from);
                                    const toNode = nodeMap.get(link.to);
                                    if (!fromNode || !toNode) return null;
                                    return (
                                        <line
                                            key={`${link.from}-${link.to}-${index}`}
                                            className={styles.link}
                                            data-link-from={link.from}
                                            data-link-to={link.to}
                                            x1={fromNode.x}
                                            y1={fromNode.y}
                                            x2={toNode.x}
                                            y2={toNode.y}
                                        />
                                    );
                                })}
                            </svg>

                            <div className={styles.mapNodes}>
                                {selectedRoadmap.nodes.map((node) => (
                                    <button
                                        key={node.id}
                                        type="button"
                                        className={styles.node}
                                        data-node-id={node.id}
                                        data-group={node.group}
                                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                                        onMouseEnter={() => highlightLinks(node.id)}
                                        onFocus={() => highlightLinks(node.id)}
                                        onBlur={clearActiveLinks}
                                        onMouseLeave={clearActiveLinks}
                                        onClick={() => handleNodeClick(node.tagSlug)}
                                        aria-label={`Open courses tagged ${node.title}`}
                                    >
                                        <span className={styles.nodePlanet} aria-hidden="true" />
                                        <span className={styles.nodeLabel}>{node.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.mapList}>
                            {selectedRoadmap.nodes.map((node) => (
                                <button
                                    key={`${node.id}-list`}
                                    type="button"
                                    className={styles.mapListItem}
                                    data-group={node.group}
                                    onClick={() => handleNodeClick(node.tagSlug)}
                                >
                                    <span className={styles.mapListPlanet} aria-hidden="true" />
                                    <span className={styles.mapListLabel}>{node.title}</span>
                                </button>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Roadmaps2;
