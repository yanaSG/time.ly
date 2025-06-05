import React, { useEffect, useState } from "react";
import { useNotebooks } from "../../../providers/NotebookProvider";
import suggestionService from "../../../services/suggestionService";
import SuggestionButton from "../ui/buttons/SuggestionButton";

const SuggestionTab: React.FC = () => {
  const { currentNotebook } = useNotebooks();
  const [suggestion, setSuggestion] = useState<string>("Loading suggestion...");

  useEffect(() => {
    const getSuggestion = async () => {
      if (currentNotebook) {
        try {
          const result = await suggestionService.fetchNotebookSuggestion({
            title: currentNotebook.title,
            topics: currentNotebook.description || "",
            mastery_goal: currentNotebook.mastery_goal || "",
          });
          setSuggestion(result);
        } catch (error) {
          setSuggestion("Could not fetch suggestion.");
        }
      }
    };
    getSuggestion();
  }, [currentNotebook]);

  return (
    <div className="p-4">
      <SuggestionButton message={suggestion} />
    </div>
  );
};

export default SuggestionTab;