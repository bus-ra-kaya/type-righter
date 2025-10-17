import "./progressbar.css"

interface ProgressBarProps {
    current: number,
    total: number
}

export default function ProgressBar({current, total}:ProgressBarProps){

    const percentage = (current / total) * 100;
    const width = Math.min(100, Math.max(0, percentage));

    return (
        <div className="progress-bar">
            <div 
                className="progress-fill" 
                style={{width: `${width}%`}}
                role="progress bar"
                aria-valuenow={current}
                aria-valuemax={total > 100 ? 100 : total}>
            </div>
        </div>
    )
}