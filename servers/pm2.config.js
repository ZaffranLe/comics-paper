module.exports = {
    apps: [
        {
            name: "comics_paper",
            script: "npm",
            args: "run build",
            env_production: {
                NODE_ENV: "production",
            },
        },
    ],
};
